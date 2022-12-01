=begin
===============================================================================
 Half encounter rate
===============================================================================
 This script will set encounter rate to half, with a minumim steps of 15
 Also to compensate that, gold and exp gained is doubled
-------------------------------------------------------------------------------
=end

class Game_Player < Game_Character
  def make_encounter_count
    n = $game_map.encounter_step
    @encounter_count = rand(n) + rand(n) + 1
    @encounter_count = @encounter_count * 2
    if (@encounter_count < 15)
      @encounter_count = 15
    end
  end
end

module BattleManager #This part is not tested
	def self.gain_gold
	  if $game_troop.gold_total > 0
	  	gold_total2 = $game_troop.gold_total * 2
	    text = sprintf(Vocab::ObtainGold, gold_total2)
	    $game_message.add('\.' + text)
	    $game_party.gain_gold(gold_total2)
	  end
	  wait_for_message
	end

  def self.gain_exp
  	exp2 = $game_troop.exp_total * 2
    $game_party.all_members.each do |actor|
      actor.gain_exp(exp2)
    end
    wait_for_message
  end
end