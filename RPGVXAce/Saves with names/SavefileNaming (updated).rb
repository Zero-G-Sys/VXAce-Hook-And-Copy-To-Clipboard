=begin
Savefile naming - When "SaveX" doesn't mean anything to you and your players!
this is Orochii Zouveleki's doing
Some changes by Zero_G
Version 1.20

INSTRUCTIONS:
Place it over Main, and that's it.
There are some things you can configure at the top part of the script. However it works out of the box.
This script needs OriginalWij & Yanfly keyboard module.

Class methods listing:

module OZ_SaveFileNameConfig
  -New methods
    def self.saveDir
    def self.checkFilePath
    def self.cleanFilename(orig)

module DataManager
  -Overwritten methods:
    def self.save_file_exists?
    def self.savefile_max
    def self.make_filename(name)
    def self.savefile_time_stamp(index)
    def self.latest_savefile_index
    def self.last_savefile_index

class Window_SaveFile < Window_Base
  -Alias listing
    alias oznamesave_initialize initialize
  -Overwritten methods
    def initialize(height, index, name)
    def refresh
    def draw_party_characters(x, y)
    def draw_playtime(x, y, width, align)
  -New methods
    attr_accessor :file_name

class Window_KeybInput < Window_Base #new class
  -"New" methods
    attr_accessor :value
    def initialize
    def window_width
    def refresh
    def value
    def update
    def open
  
class Scene_File < Scene_MenuBase
  -Alias listing
    alias oznamesave_terminate terminate
    def terminate
  -Overwritten methods
    def update
    def create_savefile_windows
    def init_selection
  -New methods
    def selected_name
    def start_set_name
    def update_setting_name
    def end_setting_name
  
class Scene_Save < Scene_File
  -Overwritten methods
    def on_savefile_ok
    def item_max
  -New methods
    def end_setting_name
  
class Scene_Load < Scene_File
  -Overwritten methods
    def on_savefile_ok

=end

module OZ_SaveFileNameConfig
=begin
#
# START OF CONFIGURATION
#
=end
  
  # Since your preferred filename length can vary with font/etc, here it is
  MAX_CHARACTERS = 24
  
  # Visible text for creating a new savefile
  CREATE_NEW = "New Save"
  
  # Default name for savefiles, use %s to add the savefile index
  NEW_SAVEFILE = "Save %d - "
  
  # Save file extension
  SAVE_EXT = ".rvdata2"
  
  # If you want to store it within the game's folder, use ""
  # Use ENV['APPDATA'] to store savefiles at C:\Users\[yourUser]\AppData\Roaming
  # which is useful for Steam, itch or any other platform that implements 
  # auto-updates.
  SAVE_LOCATION = ""
  # Example for storing at current user's appdata
  # SAVE_LOCATION = ENV['APPDATA'] + "/YourGameName/"
  
  # Saves directory within the save location
  SAVE_DIR = "Saves"
  
=begin
#
# END OF CONFIGURATION
#
=end
  def self.saveDir
    "#{SAVE_LOCATION}#{SAVE_DIR}".gsub(/\\/) {"/"}
  end
  
  def self.checkFilePath
    path = saveDir.split(/[\/]/)
    fullpath = ""
    path.each { |str|
      fullpath += "#{str}/"
      if str[/:/] == nil
        if !FileTest.exist?(fullpath)
          Dir.mkdir(fullpath)
        end
      end
    }
  end
  
  def self.cleanFilename(orig)
    # Remove the path
    a = orig.gsub(saveDir+"/"){""}
    # Remove the extension
    a.gsub!(SAVE_EXT){""}
    a
  end
end

#==============================================================================
# ** DataManager
#------------------------------------------------------------------------------
#  This module manages the database and game objects. Almost all of the 
# global variables used by the game are initialized by this module.
#==============================================================================

module DataManager
  #--------------------------------------------------------------------------
  # * Determine Existence of Save File
  #--------------------------------------------------------------------------
  def self.save_file_exists?
    OZ_SaveFileNameConfig.checkFilePath
    p = OZ_SaveFileNameConfig.saveDir + "/*#{OZ_SaveFileNameConfig::SAVE_EXT}"
    return !Dir.glob(p).empty?
  end
  #--------------------------------------------------------------------------
  # * Maximum Number of Save Files
  #--------------------------------------------------------------------------
  def self.savefile_max
    p = OZ_SaveFileNameConfig.saveDir + "/*#{OZ_SaveFileNameConfig::SAVE_EXT}"
    return Dir.glob(p).size
  end
  #--------------------------------------------------------------------------
  # * Create Filename
  #     index : File Index
  #--------------------------------------------------------------------------
  def self.make_filename(name)
    p = OZ_SaveFileNameConfig.saveDir + "/%s#{OZ_SaveFileNameConfig::SAVE_EXT}"
    return sprintf(p,name)
  end
  #--------------------------------------------------------------------------
  # * Get Update Date of Save File
  #--------------------------------------------------------------------------
  def self.savefile_time_stamp(index)
    p = OZ_SaveFileNameConfig.saveDir + "/*#{OZ_SaveFileNameConfig::SAVE_EXT}"
    ary = Dir.glob(p)
    return File.mtime(make_filename(ary[index])) rescue Time.at(0)
  end
  #--------------------------------------------------------------------------
  # * Get File Index with Latest Update Date
  #--------------------------------------------------------------------------
  def self.latest_savefile_index
    return savefile_max.times.max_by {|i| savefile_time_stamp(i) }
  end
  #--------------------------------------------------------------------------
  # * Get Index of File Most Recently Accessed
  #--------------------------------------------------------------------------
  def self.last_savefile_index
    p = OZ_SaveFileNameConfig.saveDir + "/*#{OZ_SaveFileNameConfig::SAVE_EXT}"
    ary = Dir.glob(p)
    ary.each_with_index{|e,i| return i if (e==@last_savefile_index) }
    return nil
  end
end

#==============================================================================
# ** Window_SaveFile
#------------------------------------------------------------------------------
#  This window displays save files on the save and load screens.
#==============================================================================

class Window_SaveFile < Window_Base
  attr_accessor :file_name
  #--------------------------------------------------------------------------
  # * Object Initialization
  #     index : index of save files
  #--------------------------------------------------------------------------
  alias oznamesave_initialize initialize
  def initialize(height, index, name)
    # Slice fixes file-name to save-name ("Saves/save1.rvdata2" to "save1")
    @file_name = name==nil ? "\000" : OZ_SaveFileNameConfig.cleanFilename(name)
    oznamesave_initialize(height, index)
  end
  #--------------------------------------------------------------------------
  # * Refresh
  #--------------------------------------------------------------------------
  def refresh
    contents.clear
    change_color(normal_color)
    draw_party_characters(152, 58)
    name = (@file_name=="\000") ? OZ_SaveFileNameConfig::CREATE_NEW : @file_name
    draw_text(4, 0, 320, line_height, name)
    @name_width = text_size(name).width
    draw_playtime(0, contents.height - line_height, contents.width - 4, 2)
  end
  #--------------------------------------------------------------------------
  # * Draw Party Characters
  #--------------------------------------------------------------------------
  def draw_party_characters(x, y)
    header = DataManager.load_header(@file_name)
    return unless header
    header[:characters].each_with_index do |data, i|
      draw_character(data[0], data[1], x + i * 48, y)
    end
  end
  #--------------------------------------------------------------------------
  # * Draw Play Time
  #--------------------------------------------------------------------------
  def draw_playtime(x, y, width, align)
    header = DataManager.load_header(@file_name)
    return unless header
    draw_text(x, y, width, line_height, header[:playtime_s], 2)
  end
end

#==============================================================================
# ** Window_Gold
#------------------------------------------------------------------------------
#  This window displays the party's gold.
#==============================================================================

class Window_KeybInput < Window_Base
  attr_accessor :value
  #--------------------------------------------------------------------------
  # * Object Initialization
  #--------------------------------------------------------------------------
  def initialize
    super(0, 0, window_width, fitting_height(2))
    self.openness = 0
    refresh
  end
  #--------------------------------------------------------------------------
  # * Get Window Width
  #--------------------------------------------------------------------------
  def window_width
    return 480
  end
  #--------------------------------------------------------------------------
  # * Refresh
  #--------------------------------------------------------------------------
  def refresh
    contents.clear
    draw_text(0,0,window_width,self.height-32,value)
  end
  #--------------------------------------------------------------------------
  # * Get Party Gold
  #--------------------------------------------------------------------------
  def value
    @value
  end
  def update
    super
    return if self.openness != 255
    if Input.typing?
      return if @value.size > OZ_SaveFileNameConfig::MAX_CHARACTERS
      @value+=Input.key_type
      refresh
    elsif Input.repeat?(Input::BACK)
      return if (@value.size==0)
      @value = @value[0,@value.size-1]
      refresh
    end
  end
  #--------------------------------------------------------------------------
  # * Open Window
  #--------------------------------------------------------------------------
  def open
    refresh
    super
  end
end

#==============================================================================
# ** Scene_File
#------------------------------------------------------------------------------
#  This class performs common processing for the save screen and load screen.
#==============================================================================

class Scene_File < Scene_MenuBase
  #--------------------------------------------------------------------------
  # * Termination Processing
  #--------------------------------------------------------------------------
  alias oznamesave_terminate terminate
  def terminate
    oznamesave_terminate
    @name_set_window.dispose
  end
  #--------------------------------------------------------------------------
  # * Frame Update
  #--------------------------------------------------------------------------
  def update
    super
    @savefile_windows.each {|window| window.update }
    @setting_name ? update_setting_name : update_savefile_selection
  end
  #--------------------------------------------------------------------------
  # * Create Save File Window
  #--------------------------------------------------------------------------
  def create_savefile_windows
    p = OZ_SaveFileNameConfig.saveDir + "/*#{OZ_SaveFileNameConfig::SAVE_EXT}"
    ary = Dir.glob(p)
    @savefile_windows = Array.new(item_max) do |i|
      Window_SaveFile.new(savefile_height, i, ary[i])
    end
    @savefile_windows.each {|window| window.viewport = @savefile_viewport }
    @name_set_window=Window_KeybInput.new
    @name_set_window.viewport = @savefile_viewport
  end
  #--------------------------------------------------------------------------
  # * Initialize Selection State
  #--------------------------------------------------------------------------
  def init_selection
    @index = 0#first_savefile_index
    begin
      @savefile_windows[@index].selected = true
    rescue
      
    end
    self.top_index = @index - visible_max / 2
    ensure_cursor_visible
  end
  
  def selected_name
    @savefile_windows[@index].file_name
  end
  def start_set_name
    @name_set_window.y=@savefile_windows[@index].y
    @name_set_window.open
    #@name_set_window.value = selected_name
    new_name = sprintf(OZ_SaveFileNameConfig::NEW_SAVEFILE, @index)
    @name_set_window.value = new_name
    
    @name_set_window.refresh
    @setting_name=true
  end
  def update_setting_name
    #@name_set_window.update # This was putting the "zz" on new saves
    return if @name_set_window.openness != 255
    if Input.trigger?(Input::ENTER)
      end_setting_name
    end
  end
  def end_setting_name
    @savefile_windows[@index].file_name = @name_set_window.value
    @name_set_window.close
    @setting_name=false
  end
end

#==============================================================================
# ** Scene_Save
#------------------------------------------------------------------------------
#  This class performs save screen processing. 
#==============================================================================

class Scene_Save < Scene_File
  #--------------------------------------------------------------------------
  # * Confirm Save File
  #--------------------------------------------------------------------------
  def on_savefile_ok
    super
    if selected_name=="\000"
      start_set_name
      return
    end
    if DataManager.save_game(selected_name)
      on_save_success
    else
      Sound.play_buzzer
    end
  end
  
  def item_max
    DataManager.savefile_max+1
  end
  def end_setting_name
    super
    on_savefile_ok
  end
end

#==============================================================================
# ** Scene_Load
#------------------------------------------------------------------------------
#  This class performs load screen processing. 
#==============================================================================

class Scene_Load < Scene_File
  #--------------------------------------------------------------------------
  # * Confirm Save File
  #--------------------------------------------------------------------------
  def on_savefile_ok
    super
    if DataManager.load_game(selected_name)
      on_load_success
    else
      Sound.play_buzzer
    end
  end
end