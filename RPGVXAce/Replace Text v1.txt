=begin
===============================================================================
 Replace Text v1.0
 Author: Zero_G
 Version: RGSS3
===============================================================================
 == Description ==
 This script will replace word or sentences from the game.
 
 Useful for game translations that have a word wrong, or a bad character
 for example a ` or ’ instead of ' .
 Or to change localizatins that you don't like, for example replace all
 -san with an empty space to delete them

 == Terms of Use ==
 - Free for use in non-commercial projects.
 - Free for use in commercial projects.
 - Please provide credits to Zero_G.

 == Credits ==
 No one.
 
 == Usage ==
 Just add the plugin before main.
--------------------------------------------------------------------------------
=end

module ZERO
  # Add a replacement in each line, text to replace can be a regex
  # ex: /word/
  # To match a whole word only put it between \b
  # ex: /\bword\b/
	REPLACEMENTS = {
    #"Text to replace" => "Replacement text",
    #/Text to replace/ => "Replacement text",
    "`" => "'",
    "´" => "'",
    "’" => "'",
  }
end

class Window_Message < Window_Base
  # Overwrite
  def process_all_text
    open_and_wait
    text = convert_escape_characters($game_message.all_text)
    
    ZERO::REPLACEMENTS.each do | base, replacement |
        text.gsub! base, replacement
    end 
    
    pos = {}
    new_page(text, pos)
    process_character(text.slice!(0, 1), text, pos) until text.empty?
  end
end