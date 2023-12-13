from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

from sqlmodel import SQLModel

from models import Feature, FeatureCollection, User

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
target_metadata = SQLModel.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.

# List of tables to ignore
ignore_tables = {
    "pagc_rules",
    "pagc_lex",
    "featnames",
    "loader_lookuptables",
    "addrfeat",
    "loader_variables",
    "loader_platform",
    "geocode_settings_default",
    "place_lookup",
    "state_lookup",
    "layer",
    "zip_lookup",
    "zip_lookup_all",
    "street_type_lookup",
    "state",
    "direction_lookup",
    "secondary_unit_lookup",
    "spatial_ref_sys",
    "county",
    "zip_state_loc",
    "pagc_gaz",
    "addr",
    "bg",
    "zip_lookup_base",
    "tract",
    "countysub_lookup",
    "place",
    "tabblock",
    "faces",
    "county_lookup",
    "edges",
    "tabblock20",
    "zcta5",
    "zip_state",
    "geocode_settings",
    "topology",
    "cousub",
}


def include_object(object, name, type_, reflected, compare_to):
    if type_ == "table" and name in ignore_tables:
        return False
    return True


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        include_object=include_object,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            include_object=include_object,
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
