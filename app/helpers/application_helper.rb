module ApplicationHelper
  def page_title(path)
    case path
    when '/' then 'Home'
    end
  end
end
