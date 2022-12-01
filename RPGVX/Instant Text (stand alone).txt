class Window_Message < Window_Selectable
  def update_show_fast
    @show_fast = true
    if @show_fast and @wait_count > 0
      @wait_count -= 1
    end
  end
end