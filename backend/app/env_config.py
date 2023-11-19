from decouple import config

REL_DATABASE_URL = config('REL_DATABASE_URL')
THIS_SERVER_URL = config('THIS_SERVER_URL')
NUMBER_OF_MEALS = int(config('NUMBER_OF_MEALS'))
OPENAI_API_KEY = config('OPENAI_API_KEY')

