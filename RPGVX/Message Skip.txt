=begin
===============================================================================
 Skip Messages (compatibility Hide textbox with ocupacity)
 Author: Zero_G
 Version: RGSS2
===============================================================================
This script will skip messages while a button is pressed
--------------------------------------------------------------------------------
=end

module ZERO
    SKIP_BUTTON = Input::CTRL
end

class Window_Message < Window_Selectable

  def update_show_fast
    if self.pause or self.openness < 255
      @show_fast = false
    elsif (Input.press?(ZERO::SKIP_BUTTON)) or
        (Input.trigger?(Input::C) and @wait_count < 2)
      @show_fast = true
    elsif not Input.press?(Input::C)
      @show_fast = false
    end
    if @show_fast and @wait_count > 0
      @wait_count -= 1
    end
  end

  alias zero_input_pause input_pause
  def input_pause
    if Input.press?(ZERO::SKIP_BUTTON)
      self.pause = false
      if @text != nil and not @text.empty?
        new_page if @line_count >= MAX_LINE
      else
        terminate_message
      end
    else
      zero_input_pause
    end
  end
end