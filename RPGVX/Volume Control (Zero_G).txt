=begin
===============================================================================
 Volume Control
 Author: Zero_G
 Version: RGSS2
===============================================================================
 == Description ==
 This script will allow you to change the the general volume of BGM, BGS, SE
 and ME. Alternatevly you can use game variables to set audio volumes, you must
 initialize the volume values when you start the game, else it will read 0
 volume.

 == Terms of Use ==
 - Free for use in non-commercial projects.
 - Free for use in commercial projects.
 - Please provide credits to Zero_G and �ނ���Ru (Rutan)

 == Credits ==
 Based on Volume menu plugin from �ނ���Ru (Rutan) 

 == Usage ==
 Just add the plugin before main. If using variables, remember to set them a
 value when starting a new game.
 
 == Changelog ==
 v1.1 Fixed a crash when restarting game (Stack too deep on aliases)
 v1.0 Initial
--------------------------------------------------------------------------------
=end

module ZERO
  BGM_VOLUME = 100
  BGM_VARIABLE = 0 # Use variable id or 0 to use BGM_VOLUME
  
  BGS_VOLUME = 100
  BGS_VARIABLE = 0 # Use variable id or 0 to use BGS_VOLUME
  
  SE_VOLUME = 100
  SE_VARIABLE = 0 # Use variable id or 0 to use SE_VOLUME
  
  ME_VOLUME = 100
  ME_VARIABLE = 0 # Use variable id or 0 to use ME_VOLUME
end

class << Audio
  #-----------------------------------------------------------------------------
  # �� Playback: BGM
  #-----------------------------------------------------------------------------
  alias hzm_vxa_audioVol_bgm_play bgm_play unless $@
  def bgm_play(filename, volume = 100, pitch = 100)
    bgm_vol = ZERO::BGM_VOLUME
    bgm_vol = $game_variables[ZERO::BGM_VARIABLE] if ZERO::BGM_VARIABLE != 0
    bgm_vol = ZERO::BGM_VOLUME if $scene.instance_of? Scene_Title
    hzm_vxa_audioVol_bgm_play(filename, bgm_vol * volume / 100, pitch)
  end
  #-----------------------------------------------------------------------------
  # �� Playback: BGS
  #-----------------------------------------------------------------------------
  alias hzm_vxa_audioVol_bgs_play bgs_play unless $@
  def bgs_play(filename, volume = 100, pitch = 100)
    bgs_vol = ZERO::BGS_VOLUME
    bgs_vol = $game_variables[ZERO::BGS_VARIABLE] if ZERO::BGS_VARIABLE != 0
    bgs_vol = ZERO::BGS_VOLUME if $scene.instance_of? Scene_Title
    hzm_vxa_audioVol_bgs_play(filename,bgs_vol * volume / 100, pitch)
  end
  #-----------------------------------------------------------------------------
  # �� Playback: SE
  #-----------------------------------------------------------------------------
  alias hzm_vxa_audioVol_se_play se_play unless $@
  def se_play(filename, volume = 100, pitch = 100)
    se_vol = ZERO::SE_VOLUME
    se_vol = $game_variables[ZERO::SE_VARIABLE] if ZERO::SE_VARIABLE != 0
    se_vol = ZERO::SE_VOLUME if $scene.instance_of? Scene_Title or $scene.instance_of? Scene_File
    hzm_vxa_audioVol_se_play(filename, se_vol * volume / 100, pitch)
  end
  #-----------------------------------------------------------------------------
  # �� Playback: ME
  #-----------------------------------------------------------------------------
  alias hzm_vxa_audioVol_me_play me_play unless $@
  def me_play(filename, volume = 100, pitch = 100)
    me_vol = ZERO::ME_VOLUME
    me_vol = $game_variables[ZERO::ME_VARIABLE] if ZERO::ME_VARIABLE != 0
    me_vol = ZERO::ME_VOLUME if $scene.instance_of? Scene_Title
    hzm_vxa_audioVol_me_play(filename, me_vol * volume / 100, pitch)
  end
end