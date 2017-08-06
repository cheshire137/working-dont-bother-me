json.tracks do
  json.array! @tracks do |track|
    json.id track['id']
    json.name track['name']
    json.uri track['uri']
    if image = small_image(track['album']['images'])
      json.image do
        json.url image['url']
        json.width image['width']
        json.height image['height']
      end
    end
    json.artists do
      json.array! track['artists'] do |artist|
        json.id artist['id']
        json.name artist['name']
      end
    end
  end
end
