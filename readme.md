```
docker run -d \
  --name dt \
  -v /root/database:/src/database \
  -p 80:6969 \
  -e VIRTUAL_HOST=duongtang.clgt.vn \
  -e LETSENCRYPT_HOST=duongtang.clgt.vn \
  -e LETSENCRYPT_EMAIL=quocnguyen@clgt.vn \
  -e SHORT_URL_SERVICE=http://go.clgt.vn \
  -e ALLOW_SHORT_URL=0 \
  -e ADMIN_USERNAME=admin \
  -e ADMIN_PASSWORD=denthecat \
  -e BUGSNAG_API=3fab4a6fbc30d7e939102ebf055ab661 \
  -e ALLOW_CACHE=1 \
  quocnguyen/dt-api
  ```
