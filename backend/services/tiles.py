from osgeo import gdal
from PIL import Image
import numpy as np
from math import log, tan, radians, cos, pi, floor, degrees, atan, sinh
from dotenv import load_dotenv, find_dotenv
import os

load_dotenv(find_dotenv())

ENDPOINT_URL = os.getenv("ENDPOINT_URL")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")

os.environ["AWS_ACCESS_KEY_ID"] = AWS_ACCESS_KEY_ID
os.environ["AWS_SECRET_ACCESS_KEY"] = AWS_SECRET_ACCESS_KEY
os.environ["AWS_DEFAULT_REGION"] = "ap-southeast-2"
os.environ["AWS_S3_ENDPOINT"] = ENDPOINT_URL


def sec(x):
    return 1 / cos(x)


def latlon_to_xyz(lat, lon, z):
    tile_count = pow(2, z)
    x = (lon + 180) / 360
    y = (1 - log(tan(radians(lat)) + sec(radians(lat))) / pi) / 2
    return (tile_count * x, tile_count * y)


def bbox_to_xyz(lon_min, lon_max, lat_min, lat_max, z):
    x_min, y_max = latlon_to_xyz(lat_min, lon_min, z)
    x_max, y_min = latlon_to_xyz(lat_max, lon_max, z)
    return (floor(x_min), floor(x_max), floor(y_min), floor(y_max))


def mercatorToLat(mercatorY):
    return degrees(atan(sinh(mercatorY)))


def y_to_lat_edges(y, z):
    tile_count = pow(2, z)
    unit = 1 / tile_count
    relative_y1 = y * unit
    relative_y2 = relative_y1 + unit
    lat1 = mercatorToLat(pi * (1 - 2 * relative_y1))
    lat2 = mercatorToLat(pi * (1 - 2 * relative_y2))
    return (lat1, lat2)


def x_to_lon_edges(x, z):
    tile_count = pow(2, z)
    unit = 360 / tile_count
    lon1 = -180 + x * unit
    lon2 = lon1 + unit
    return (lon1, lon2)


def tile_edges(x, y, z):
    lat1, lat2 = y_to_lat_edges(y, z)
    lon1, lon2 = x_to_lon_edges(x, z)
    return [str(lon1), str(lat2), str(lon2), str(lat1)]


def return_tile(layer_name, x, y, z):
    open_file = gdal.Open("/vsis3/cog-maps/" + layer_name, gdal.GA_ReadOnly)
    # mask_dataset = gdal.Open(
    #     "/vsis3/cog-maps/645465335874aa00066577b2_cog_webp_tiled.tif.msk"
    # )
    test_mem = "/vsimem/{}_{}_{}.png".format(x, y, z)

    tile_bounds = tile_edges(x, y, z)

    return_image = None

    try:
        out_ds = gdal.Warp(
            test_mem,
            open_file,
            format="PNG",
            outputBounds=[
                tile_bounds[0],
                tile_bounds[1],
                tile_bounds[2],
                tile_bounds[3],
            ],
            errorThreshold=0,
            width=256,
            height=256,
            dstSRS="EPSG:4326",
            resampleAlg="average",
        )

        red_band = out_ds.GetRasterBand(1).ReadAsArray()
        green_band = out_ds.GetRasterBand(2).ReadAsArray()
        blue_band = out_ds.GetRasterBand(3).ReadAsArray()
        alpha_band = out_ds.GetRasterBand(4).ReadAsArray()

        # # Create an alpha channel array with the desired transparency
        # alpha_channel = np.ones_like(red_band, dtype=np.uint8) * 255  # Fully opaque

        # # Check if any of the RGB bands have no data
        # no_data_mask = (red_band == 0) & (green_band == 0) & (blue_band == 0)

        # # Update the alpha channel based on the no data mask
        # alpha_channel[
        #     no_data_mask
        # ] = 0  # Set alpha to 0 for pixels with no data in RGB bands

        # Create the RGBA array by stacking the RGB bands with the updated alpha channel
        rgba_array = np.dstack((red_band, green_band, blue_band, alpha_band))
        return_image = Image.fromarray(rgba_array)

    except Exception as e:
        print(e)

    return return_image
