module ApplicationHelper
  def page_title(path)
    case path
    when '/' then 'Home'
    end
  end

  def small_image(images)
    images.detect { |image| image['height'] <= 64 }
  end
end
