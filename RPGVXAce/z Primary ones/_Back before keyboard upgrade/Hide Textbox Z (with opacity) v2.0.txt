=begin
===============================================================================
 Hide Textbox Z (with opacity) v2.0
 Author: Zero_G
 Version: RGSS3
===============================================================================
 This script will allow a player to:
  -Mode 1: Hide the textbox window while pressing a key.
  -Mode 2: Hide the textbox while still displaying the text.
 
 == Usage == 
 - Press HIDE_KEY (default d) to hide textbox completely, press again to restore
   it, or OK button to restore window and show next message.

 - Press OPACITY_KEY (default s) to hide textbox while still displaying text,
   press it again to restore it. Further message windows will still
   remain transparent until the user presses the key again.

 - OK_KEY is for returing visibility of text box on next page, default C (z).
 
 == Bindings ==
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
 
 == Changelog ==
 v2.0 Mayor rewrite
    - Change usage of command_101 to update_background
    - Dim window now erases properly (Mode 2)
    - Window is restored properly (Mode 2)
 v1.7 Changed method of textbox hiding, now dim backgrounds are also hidden
 v1.6 Changed how default opacity of textbox is stored (Changes not applied)
 v1.5 Added the functionality of hiding dim backgrounds (on next message)
 v1.4 - Fixed the problem where an effect would reset the background opacity
      - Reverted v1.3 changes, as they are not necessary
 v1.3 Added functionality of both v1.1 and v1.2
 v1.2 Changed back opacity to whole window opacity (no window borders)
 v1.1 Added back opacity
--------------------------------------------------------------------------------
=end

module ZERO
  
  HIDE_KEY = :Z    # Set hide textbox window and text button
  OK_KEY = :C   # Set defualt ok button (show next message)
  OPACITY_KEY = :Y   # Set hide textbox window while displaying text button
  
  # Set default window opacity.
  # In case game doens't use the default 255 change it to it's proper value.
  # 255 is opaque, 0 transparent.
  DEFAULT_OPACITY = 255  
end

class Window_Message < Window_Base
  @@hideTextboxPartial = false
  @@normalBackground = false
  @@dimBackground = false

  # @background states
  # 0 = Normal
  # 1 = Dim
  # 2 = Transparent
  
  # Mode 2 - Handle window background before it is generated so that next 
  # messages remain transparent (this method triggers when a background 
  # change is detected)
  alias zero_update_background update_background
  def update_background

    if @@hideTextboxPartial
      @@normalBackground = ($game_message.background == 0)
      @@dimBackground = ($game_message.background == 1)
      $game_message.background = 2 # set background to transparent
      if @@dimBackground
        @back_sprite.bitmap = nil
      end
    end

    zero_update_background
  end # end update_background
  
  # Handle inputs
  alias zero_window_message_update update
  def update
    
    # Mode 2 - Hide & Restore
    if Input.trigger?(ZERO::OPACITY_KEY)
      #puts @background
      if !@@hideTextboxPartial
        if @background == 0
          self.opacity = 0
          @@normalBackground = true
          @@dimBackground = false
        elsif @background == 1
          @back_sprite.bitmap = nil
          @@dimBackground = true
          @@normalBackground = false
        end
        @@hideTextboxPartial = true
      else
        #puts @back_bitmap
        #puts "dimBack: #{@@dimBackground}"
        #puts "normalback: #{@@normalBackground}"
        if @@normalBackground 
          @background = 0
          self.opacity = ZERO::DEFAULT_OPACITY
        elsif @@dimBackground
          @background = 1
          @back_sprite.bitmap = @back_bitmap
        end
        @@hideTextboxPartial = false
      end
    end
    
    # Mode 1 - Hide & Restore
    if Input.trigger?(ZERO::HIDE_KEY)
      if self.visible == true
        hide
        if @background == 1
          @background = 0
          @black_window = 2
        end
      else
        show
        if @black_window == 2
          @background = 1
          @black_window = 0
        end
      end
    end
    
    # Mode 1 - Show textbox if hidden and pressed next message button
    if Input.press?(ZERO::OK_KEY) 
      show
      if @black_window == 2
        @background = 1
        @black_window = 0
      end
    end
    
    zero_window_message_update
  end # end def update
  
end # class Window_Message