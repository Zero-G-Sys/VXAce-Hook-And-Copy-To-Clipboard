=begin
===============================================================================
 Hide textbox (with ocupacity)
 Message Visibility by Zero_G
 Version: RPG MAKER XP
===============================================================================
 This script will allow to player sets message window visible or unvisible with 
 a key.
 And toogle window ocupacy (make it transparent) while displaying text
 with another key. 
 
 (Not implemented) In case the message displayed used a dim background, 
 it will make it transparent in the next message.
 
 KEY is for hiding the window.
 KEY2 is for returing visibility of text box on next page, default C (z).
 KEY3 is for hiding the textbox but not the text (borderless).
 
 Example : 
 -Press "D" to hide message window and repress "D" to show message 
 window.
 -Press "C" to turn message window transparent and repress "C" to set default
 ocupacy.
 
 Possible key bindings: A B C X Y Z L R, 
 SHIFT CTRL ALT (these are defualt keyboard bindings)
 Functions Keys use: Input::F# (ex: Input::F5) [F1-4 can't be used]
 Gamepad = Keboard key
 A = shift
 B = x
 C = z
 X = a
 Y = s
 Z = d
 L = q
 R = w
--------------------------------------------------------------------------------
=end

module ZERO
    DEFAULT_BACK_OPACITY = 150
    HIDE_KEY = Input::Z    # Set hide textbox window and text button
    OK_KEY2 = Input::C   # Set defualt ok button (show next message)
    TRANSPARENCY_KEY = Input::Y   # Set hide textbox window while displaying text button
end

class Window_Message < Window_Selectable
  @transparent = 0
  @hide = 0
  
  alias zero_update update
  def update
    zero_update
    
    # Hide msgbox completly
    if Input.trigger?(ZERO::HIDE_KEY)
        if @hide == 1
          self.opacity          = 255
          self.back_opacity     = ZERO::DEFAULT_BACK_OPACITY
          self.contents_opacity = 255
          @name_window_frame.visible = true unless @name_window_frame.nil?
          @name_window_text.visible  = true unless @name_window_text.nil?
          @input_number_window.visible  = true unless @input_number_window.nil?
          @hide = 0
        else
          self.opacity            = 0
          self.back_opacity       = 0
          self.contents_opacity   = 0
          @name_window_frame.visible = false unless @name_window_frame.nil?
          @name_window_text.visible  = false unless @name_window_text.nil?
          @input_number_window.visible  = false unless @input_number_window.nil?
          self.pause = false
          #@pause.visible = false
          @hide = 1
        end
    end

    # Restore window on next message
    if Input.trigger?(ZERO::OK_KEY2)
        if @hide == 1
          self.opacity          = 255
          self.back_opacity     = ZERO::DEFAULT_BACK_OPACITY
          self.contents_opacity = 255
          @name_window_frame.visible = true unless @name_window_frame.nil?
          @name_window_text.visible  = true unless @name_window_text.nil?
          @input_number_window.visible  = true unless @input_number_window.nil?
          @hide = 0
        end
    end

    # Hide msgbox while keeping text
    if Input.trigger?(ZERO::TRANSPARENCY_KEY)
      if @transparent == 1
        self.opacity          = 255
        self.back_opacity     = ZERO::DEFAULT_BACK_OPACITY
        @name_window_frame.visible = true unless @name_window_frame.nil?
        @name_window_text.visible  = true unless @name_window_text.nil?
        @input_number_window.visible  = true unless @input_number_window.nil?
        @transparent = 0
      else
        self.opacity            = 0
        self.back_opacity       = 0
        @name_window_frame.visible = false unless @name_window_frame.nil?
        @input_number_window.visible  = false unless @input_number_window.nil?
        self.pause = false
        @transparent = 1
      end
    end
    
    # Keep msgbox transparent for subsequent messages
    if @transparent == 1
      self.opacity            = 0
      self.back_opacity       = 0
      @name_window_frame.visible = false unless @name_window_frame.nil?
      @input_number_window.visible  = false unless @input_number_window.nil?
      self.pause = false
    end
  end    
end