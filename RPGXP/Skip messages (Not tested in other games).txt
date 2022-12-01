class Window_Message < Window_Selectable
  alias zero_skip_update update
  def udpate
    if Input.repeat?(Input::CTRL)
       if self.visible
          if $game_temp.choice_max == 0
              terminate_message
          end
        end
      end
      zero_skip_update update
    end
end