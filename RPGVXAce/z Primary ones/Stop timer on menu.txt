#Stop timer on menu

class Scene_Map < Scene_Base
  alias ale2501_call_menu call_menu unless $@
  
  def call_menu
    Old_Frame_Count.set(Graphics.frame_count)
    ale2501_call_menu
  end
end

class Scene_Menu < Scene_MenuBase
  def update
    super
    Graphics.frame_count = Old_Frame_Count.get
  end
end

module Old_Frame_Count
  def self.set(value)
    @old_frame_count = value
  end
  
  def self.get
    @old_frame_count
  end
end