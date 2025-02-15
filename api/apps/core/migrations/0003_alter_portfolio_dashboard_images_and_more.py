# Generated by Django 5.1.5 on 2025-02-06 05:34

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core", "0002_remove_blogpost_section_blogpost_section"),
    ]

    operations = [
        migrations.AlterField(
            model_name="portfolio",
            name="dashboard_images",
            field=models.ImageField(blank=True, null=True, upload_to="portfolio/"),
        ),
        migrations.AlterField(
            model_name="portfolio",
            name="log_images",
            field=models.ImageField(blank=True, null=True, upload_to="portfolio/"),
        ),
        migrations.AlterField(
            model_name="portfolio",
            name="nav_images",
            field=models.ImageField(blank=True, null=True, upload_to="portfolio/"),
        ),
        migrations.AlterField(
            model_name="portfolio",
            name="top_images",
            field=models.ImageField(blank=True, null=True, upload_to="portfolio/"),
        ),
    ]
