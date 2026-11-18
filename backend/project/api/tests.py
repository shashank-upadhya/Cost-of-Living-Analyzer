from django.test import TestCase
from rest_framework.test import APIClient
from rest_framework import status


class CityAPITests(TestCase):
    """Tests for the POST /api/post_city/ endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/post_city/'

    def test_known_city_returns_200(self):
        """A city present in the data should return 200 with index data."""
        response = self.client.post(self.url, {'city_name': 'Zurich'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('name', data)
        self.assertIn('Index', data)
        self.assertIn('coi', data['Index'])
        self.assertIsNotNone(data['name'])
        # Should have one entry per year (current, 2023, 2022, 2021, 2020)
        self.assertEqual(len(data['Index']['coi']), 5)

    def test_known_city_case_insensitive(self):
        """City lookup should be case-insensitive."""
        response = self.client.post(self.url, {'city_name': 'zurich'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(response.json()['name'])

    def test_unknown_city_returns_404(self):
        """A city not in the data should return 404."""
        response = self.client.post(self.url, {'city_name': 'FakeTownXYZ'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.json())

    def test_missing_city_name_returns_400(self):
        """An empty or missing city_name should return 400."""
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.json())

    def test_empty_city_name_returns_400(self):
        """A blank city_name should return 400."""
        response = self.client.post(self.url, {'city_name': '  '}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_response_has_all_index_keys(self):
        """Response should include all six index categories."""
        response = self.client.post(self.url, {'city_name': 'Geneva'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        index = response.json()['Index']
        for key in ('coi', 'ri', 'coipri', 'gi', 'rpi', 'lppi'):
            self.assertIn(key, index, f"Missing index key: {key}")


class CountryAPITests(TestCase):
    """Tests for the POST /api/post_country/ endpoint."""

    def setUp(self):
        self.client = APIClient()
        self.url = '/api/post_country/'

    def test_known_country_returns_200(self):
        """A country present in the data should return 200 with index data."""
        response = self.client.post(self.url, {'country_name': 'Switzerland'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertIn('name', data)
        self.assertIn('coi', data)
        self.assertIn('coi_label', data)
        # Should have country average + up to 4 top cities
        self.assertGreaterEqual(len(data['coi']), 1)
        self.assertEqual(data['coi_label'][0], 'Average')

    def test_known_country_case_insensitive(self):
        """Country lookup should be case-insensitive."""
        response = self.client.post(self.url, {'country_name': 'switzerland'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_unknown_country_returns_404(self):
        """A country not in the data should return 404."""
        response = self.client.post(self.url, {'country_name': 'Atlantis'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertIn('error', response.json())

    def test_missing_country_name_returns_400(self):
        """An empty or missing country_name should return 400."""
        response = self.client.post(self.url, {}, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.json())

    def test_response_has_all_index_keys(self):
        """Response should include all six index categories with labels."""
        response = self.client.post(self.url, {'country_name': 'Switzerland'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        for key in ('coi', 'ri', 'coipri', 'gi', 'rpi', 'lppi'):
            self.assertIn(key, data, f"Missing key: {key}")
            self.assertIn(f"{key}_label", data, f"Missing label key: {key}_label")
