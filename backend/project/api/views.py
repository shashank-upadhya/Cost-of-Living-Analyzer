from pathlib import Path

from django.conf import settings
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import json


# ---------------------------------------------------------------------------
# Data loading — resolve paths from settings.JSON_DATA_DIR (portable)
# ---------------------------------------------------------------------------

JSON_DIR = getattr(
    settings, 'JSON_DATA_DIR',
    Path(__file__).resolve().parent.parent.parent / 'json',
)


def _load_json(filename):
    """Load a JSON file from the data directory."""
    with open(JSON_DIR / filename, 'r', encoding='utf-8') as f:
        return json.load(f)


current_data = _load_json('current.json')
data_2023 = _load_json('2023.json')
data_2022 = _load_json('2022.json')
data_2021 = _load_json('2021.json')
data_2020 = _load_json('2020.json')
country_city_mapping = _load_json('list_of_countries.json')
country_details = _load_json('country_details.json')


# ---------------------------------------------------------------------------
# API views
# ---------------------------------------------------------------------------

@api_view(['POST'])
def get_country_details(request):
    country_name = request.data.get('country_name', '').strip().lower()
    if not country_name:
        return Response(
            {"error": "country_name is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    # Match the country in the country-to-city mapping
    cities = []
    for country, city_list in country_city_mapping.items():
        if country.strip().lower() == country_name:
            cities = [city.split(',')[0] for city in city_list]
            break

    if not cities:
        return Response(
            {"error": f"No data found for country: {country_name}"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Normalize city names for matching
    normalized_cities = [city.lower().replace(" ", "") for city in cities]

    # Filter city data for the matched country
    city_details_list = [
        city for city in current_data.values()
        if city['city_name'].lower().split(',')[0] in normalized_cities
    ]

    if not city_details_list:
        return Response(
            {"error": f"No city data found for country: {country_name}"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Get country-level averages from country_details.json
    country_data = None
    for country in country_details.values():
        if country['country_name'].strip().lower() == country_name:
            country_data = country
            break

    if not country_data:
        return Response(
            {"error": f"No country-level data found for: {country_name}"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Prepare the output structure
    result = {
        "name": country_data["country_name"],
        "coi": [float(country_data["coi"])],
        "coi_label": ["Average"],
        "ri": [float(country_data["ri"])],
        "ri_label": ["Average"],
        "coipri": [float(country_data["coipri"])],
        "coipri_label": ["Average"],
        "gi": [float(country_data["gi"])],
        "gi_label": ["Average"],
        "rpi": [float(country_data["rpi"])],
        "rpi_label": ["Average"],
        "lppi": [float(country_data["lppi"])],
        "lppi_label": ["Average"],
    }

    def calculate_top_cities(index_name):
        indexes = sorted(
            [
                (float(city[index_name]), city['city_name'].split(',')[0])
                for city in city_details_list
                if index_name in city
            ],
            reverse=True,
        )
        top_values = [value for value, _ in indexes[:4]]
        top_labels = [name for _, name in indexes[:4]]

        # Pad with None if fewer than 4 cities
        while len(top_values) < 4:
            top_values.append(None)
            top_labels.append(None)

        return top_values, top_labels

    for key in ["coi", "ri", "coipri", "gi", "rpi", "lppi"]:
        top_values, top_labels = calculate_top_cities(key)
        result[key].extend(top_values)
        result[f"{key}_label"].extend(top_labels)

    return Response(result)


@api_view(['POST'])
def get_city_all_years(request):
    city_name = request.data.get('city_name', '').strip()
    if not city_name:
        return Response(
            {"error": "city_name is required."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    data_sources = {
        "current": current_data,
        "2023": data_2023,
        "2022": data_2022,
        "2021": data_2021,
        "2020": data_2020,
    }

    city_name_lower = city_name.lower()
    result = {"name": None, "Index": {}}
    all_years = {}

    # Search for the city in each year's data
    for year, data in data_sources.items():
        matched_city = next(
            (city for city in data.values() if city_name_lower in city["city_name"].lower()),
            None,
        )
        all_years[year] = matched_city

        if matched_city and not result["name"]:
            result["name"] = matched_city["city_name"]

    # If no year matched, the city doesn't exist in our data
    if result["name"] is None:
        return Response(
            {"error": f"No data found for city: {city_name}"},
            status=status.HTTP_404_NOT_FOUND,
        )

    # Populate index data for all specified keys
    for key in ["coi", "ri", "coipri", "gi", "rpi", "lppi"]:
        result["Index"][key] = [
            float(year_data[key]) if year_data else None
            for year_data in all_years.values()
        ]

    return Response(result)
