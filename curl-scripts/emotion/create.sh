API="http://localhost:4741"
URL_PATH="/emotions"

curl "${API}${URL_PATH}" \
--include \
--request POST \
--header "Content-Type: application/json" \
--header "Authorization: Bearer ${TOKEN}" \
--data '{
  "emotion": {
    "name": "'"${NAME}"'",
    "description": "'"${DESCRIPTION}"'"
  }
}'

echo
