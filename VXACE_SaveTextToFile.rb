=begin
===============================================================================
 Copy Dialoge Text To File (Clipboard)
===============================================================================
 Author: Zero_G

 Save text to temporal txt, then use a node app to watch that file and copy
 its contents to clipboard.

 Will create the file in the %GameFolder%/_Clipboard/clipboard_temp.txt

 This will capture all types dialogue text, and choices if any.
 Optionally it can capture text from other plugins (In development)

 Supported plugins
 -Popup Window (吹きだしウィンドウＶＸＡｃｅ改 by 名も無き絵かき)
 -ChoiceEx (選択肢拡張)
 -Center Message Window (超簡易センターメッセージウィンドウ Ver2.00　by 星潟)
 -Map Navi (MAPナビゲーション)
 -Namebox (TheoAllen)

 *Extra functionality: Don't show text in the message box (It will still
 process in the background). Useful if you are already getting the
 JP text in another app and overlaping the windows with the textbox
 bothers you. Toggle hide/unhide text with a key.

-------------------------------------------------------------------------------
=end
module ZERO
  module CLIP
    # Don't write to file if there isn't Japanese text on the string
    IGNORE_JP_TEXT = true
    JP_REGEX = /[一-龠]+|[ぁ-ゔ]+|[ァ-ヴー]+|[ａ-ｚＡ-Ｚ０-９]+|[々〆〤！？]+/

    # Capture Choices
    CHOICES = true

    # Capture Help Window (Item-Skill descriptions)
    DESCRIPTIONS = true

    # Capture Map Navi (Text at top of some events, mainly doors and transfers)
    MAP_NAVI = true

    # D_TEXT - Not implemented yet
    D_TEXT = false
  end

  module HIDE
    # Set hide method
    # -Method 1 will use native opacity and is less intrusive but hides faces
    #  in textboxes
    # -Method 2 modifies the position and size of letters, it works well and
    #  doesn't hide faces in textboxes
    ERASE_METHOD = 1 # Use 1 or 2

    # Key to toggle between hide and show text.
    ERASE_TEXT_KEY = :F5

    # Key to reprocess text, will most likely trigger saving the text to  again
    # the file. Use it if for some reason it wasn't sent by default.
    # Only on method 1
    # For method 2 you can toggle the hide and show and it will reprocess it
    # like this one
    REDRAW_TEXT_KEY = :F6
  end
end

def save_file(text)
  if ZERO::CLIP::IGNORE_JP_TEXT
    # Nested to not impact performance when deciding to not ignore JP text
    if ZERO::CLIP::JP_REGEX.match(text).nil?
      return
    end
  end

  game_directory = Dir.pwd  # Get the current working directory (game directory)
  temp_file = File.join(game_directory, '_Clipboard/clipboard_temp.txt')

  # Write the text content to the temporary file
  File.open(temp_file, 'w') do |file|
    file.write(text)
  end
end

save_file("Write to file loaded")

# Show text instantly by default (Acelerates processing of text to file)
class Window_Message < Window_Base
  def update_show_fast
    @show_fast = true
  end
end

#-------------------------------------------------------------------------------
# Get text from normal native textbox and choices
#-------------------------------------------------------------------------------
### More general, use if Window_Message one is not enough
#~ class Window_Base < Window
#~   alias zero_clip_convert_escape_characters convert_escape_characters
#~   def convert_escape_characters(text)
#~     text = zero_clip_convert_escape_characters(text)
#~     puts text
#~     text = pre_process_text(text)
#~     save_file(text.strip)
#~     return text
#~   end
#~ end

### Get text after it is shown on textbox (better to have instant enabled)
# Could get it before it is processed, but it would need an overwrite
# Do that if neccesary
class Window_Message < Window_Base
  alias zero_clip_process_all_text process_all_text
  def process_all_text
    zero_clip_process_all_text
    return if $game_message.choice? and ZERO::CLIP::CHOICES

    text = $game_message.all_text
    text = convert_escape_characters_clipboard(text)
    text = pre_process_text(text)
    save_file(text.strip)
  end
end

### Capture choices
# Due to choices being processed before text, we send the textbox contents
# here if there are any.
# Don't get choices from $game_message.choices as you get a complete list
# and not the only ones showed on screen
if ZERO::CLIP::CHOICES
  class Window_ChoiceList < Window_Command
    alias zero_clip_start start
    def start
      choices = []
      @list.each { |item| choices.push(item[:name].to_s) }
      choices = pre_process_choices(choices)

      if $game_message.has_text?
        text = $game_message.all_text
        text = convert_escape_characters_clipboard(text)
        text = pre_process_text(text)
        save_file(text.strip + ". " + choices)
      else
        save_file(choices)
      end
      zero_clip_start
    end
  end
end

# Remove codes from text
def pre_process_text(text)
  text.gsub!(/(\e||\\)i\[122\]/i){ "❤" }          # Change hearth icon to character
  text.gsub!(/(\e||\\)(c|i)\[\d{1,3}\]/i){ "" }    # Remove color and icon codes
  text.gsub!(/(\e||\\)({|}|\.|\||!|<|>|^)/){ "" }  # Remove codes
  text.gsub!(/(\e||\\)h\[-?\d{1,2}\]/){ "" }       # Remove code from Popup Window (吹きだしウィンドウＶＸＡｃｅ改 by 名も無き絵かき)
  text.gsub!(/(\e||\\)nb\['(.*)'\] ?/) { $2+": " } # Remove code from name an turn it into "Name: xxx" (TheoAllen)

  return text
end

# Recive array of choices
# Remove choiceEx code, and format text
# Return a string of "[choiceN].[choiceN+1]"
def pre_process_choices(choices)
  new_choices = []
  choices.each do |choice|
    next unless choice

    choice = choice.gsub(/if(\(| )?s\[\d{1,2}\]\)?/i) { '' } # Remove choiceEx
    choice = choice.gsub('　') { ' ' } # Double width space to single width
    choice = '[' + choice.strip + ']'
    new_choices.push(choice)
  end
  new_choices.join('.')
end

# Clone of convert_escape_characters
# If you use the normal one text dissapears
def convert_escape_characters_clipboard(text)
  result = text.to_s.clone
  result.gsub!(/\\/)            { "\e" }
  result.gsub!(/\e\e/)          { "\\" }
  result.gsub!(/\eV\[(\d+)\]/i) { $game_variables[$1.to_i] }
  result.gsub!(/\eV\[(\d+)\]/i) { $game_variables[$1.to_i] }
  result.gsub!(/\eN\[(\d+)\]/i) { actor_name($1.to_i) }
  result.gsub!(/\eP\[(\d+)\]/i) { party_member_name($1.to_i) }
  result.gsub!(/\eG/i)          { Vocab::currency_unit }
  result
end

#-------------------------------------------------------------------------------
# Descriptions (Top Help Window)
#-------------------------------------------------------------------------------

if ZERO::CLIP::DESCRIPTIONS
  class Window_Help < Window_Base
    @@previousText = ""

    ## Get text from refresh becuase some plugins overwrite set_text
    alias zero_clip_refresh refresh
    def refresh
      unless @text.nil? or @text.empty?
        if @text != @@previousText and @text.is_a? String
          @@previousText = @text
          @text = pre_process_text(@text)
          save_file(@text.strip)
        end
      end
      zero_clip_refresh
    end
  end
end

#-------------------------------------------------------------------------------
# Extra/Plugin Windows/Text
#-------------------------------------------------------------------------------
def class_exists?(class_name)
  klass = Module.const_get(class_name)
  return klass.is_a?(Class)
rescue NameError
  return false
end

# Center Message Window (Module CMWDefine)
# 超簡易センターメッセージウィンドウ Ver2.00　by 星潟
if class_exists?("Window_CenterMessage")
  class Window_CenterMessage < Window_Base
    alias zero_clip_cmw_refresh refresh
    def refresh(text,c)
      text_to_clipboard = text
      text_to_clipboard = convert_escape_characters_clipboard(text_to_clipboard)
      text_to_clipboard = pre_process_text(text_to_clipboard)
      save_file(text_to_clipboard.strip)
      zero_clip_cmw_refresh(text,c)
    end
  end
end

# Map Navi (Text above events, normally used on doors, exit zones, etc)
if class_exists?("Sprite_Navi") and ZERO::CLIP::MAP_NAVI
  class Sprite_Navi < Sprite
    alias zero_clip_set_navi set_navi
    def set_navi(text)
      save_file(text.strip) if @text != text && !(text.nil? or text.empty?)
      zero_clip_set_navi(text)
    end
  end
end

# TODO: Add D_TEXT handling, put it under a flag.
# To capture and not ignore other text that may happen at the same time
# it may need a handling like Llule that listens for all text
# for a moment then concats it and sends/saves it

#===============================================================================
# Hide/Erase Text
#===============================================================================
### Hide Method 1
if ZERO::HIDE::ERASE_METHOD == 1
  $updateChoices = false
  class Window_Message < Window_Base
    @@hideText = false
    alias zero_window_message_update_hide update
    def update
      if Input.trigger?(ZERO::HIDE::ERASE_TEXT_KEY)
        # Check if windows is open redraw text
        if self.openness == 255
          if self.contents_opacity == 255
            @@hideText = true
          else
            @@hideText = false
          end
        end
      end

      if Input.trigger?(ZERO::HIDE::REDRAW_TEXT_KEY)
        # If windows is open redraw text
        if self.openness == 255
          @show_fast = true
          process_all_text if $game_message.has_text?
        end
        $updateChoices = true if $game_message.choice?
      end
      processHide
      zero_window_message_update_hide
    end

    # New method
    def processHide
      # Check if windows is open redraw text
      if self.openness > 200
        if @@hideText
          self.contents_opacity = 0
        else
          self.contents_opacity = 255
        end
      end
    end
  end

  class Window_Selectable < Window_Base
    def update
      if $updateChoices
        $updateChoices = false
        draw_all_items
      end
      super
      process_cursor_move
      process_handling
    end
  end
end

### Hide Method 2
if ZERO::HIDE::ERASE_METHOD == 2
  class Window_Message < Window_Base
    alias zero_window_message_update_hide update
    def update
      if Input.trigger?(ZERO::HIDE::ERASE_TEXT_KEY)
        $erase_text = !$erase_text

        # If windows is open redraw text
        if self.openness == 255
          @show_fast = true
          process_all_text if $game_message.has_text?
        end
      end
      zero_window_message_update_hide
    end

    def process_normal_character(c, pos)
      text_width = text_size(c).width
      text_width = 0 if $erase_text

      draw_text(pos[:x], pos[:y], text_width * 2, pos[:height], c)
      pos[:x] += text_width

      wait_for_one_character
    end
  end
end