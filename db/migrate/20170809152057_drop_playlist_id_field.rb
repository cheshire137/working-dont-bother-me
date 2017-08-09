class DropPlaylistIdField < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :playlist_id
  end
end
