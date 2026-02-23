from django.urls import path
from .views import get_city_all_years, get_country_details

urlpatterns=[
    path('post_country/',get_country_details,name='postCountry'),
    path('post_city/',get_city_all_years,name='postCity')
]