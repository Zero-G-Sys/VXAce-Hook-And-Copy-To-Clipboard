#No Textbox Animations

class Window_Base < Window
  def update_open
    self.openness += 255
    @opening = false if open?
  end
  
  def update_close
    self.openness -= 255
    @closing = false if close?
  end
end