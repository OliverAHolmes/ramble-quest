from pydantic import BaseSettings


class Settings(BaseSettings):
    ENV: str = "development"
    db_path: str

    @property
    def db_path(self) -> str:
        return "test.db" if self.ENV == "testing" else "database.db"


settings = Settings()
