json.playlist do
  json.name @playlist['name']
  json.url @playlist['external_urls']['spotify']
end
