# fastapiapp

## creating fastapi application

### CRUD OPERATIONS

# Architecture

backend/
    app/
        --main.py
        --database.py
        models/
            --users.py
            --company.py
            --job.py
        schemas/
            --users.py
            --company.py
            --job.py
        routers/
            --users.py
            --company.py
            --job.py
        utils/
            --token.py
            --security.py
            --oauth2.py
            ..
    alembic.ini
    alembic/env.py