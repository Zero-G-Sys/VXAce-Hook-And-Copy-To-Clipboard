/* 
 * MIT License
 * 
 * Copyright (c) 2020 Nolonar
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

//=============================================================================
// N_HideIdleMouse
//=============================================================================
/*:
 * @target MZ
 * @plugindesc Automatically hides mouse if it hasn't been moved for a while.
 * @author Nolonar
 * @url https://github.com/Nolonar/RM_Plugins-HideIdleMouse
 * 
 * @param timeout
 * @text Idle timeout
 * @desc How long the mouse can remain idle before it is hidden (in milliseconds).
 * @type number
 * @min 0
 * @default 3000
 * 
 * 
 * @help This plugin does not provide plugin commands.
 * 
 * Note:
 * The mouse cursor will only be hidden if it is hovering on top of the the
 * game window.
 * 
 * Zero_G alt version (v1.1 alt):
 *  - Add: can now hide the cursor in the black screen side bars (everywhere on the screen)
 */

(() => {
    let parameters = PluginManager.parameters('N_HideIdleMouse');
    parameters.timeout = Number(parameters.timeout) || 3000;

    let mouseIdleTimeout = null;
    let style = document.body.style;
    let defaultCursor = style.cursor;
    hideMouse(); // Hidden by default.

    // Make mouse hideable at the sides of the screen 
    style.width = '100%';
    style.height = '100%';

    let window_onmousemove = window.onmousemove;
    window.onmousemove = () => {
        if (window_onmousemove) window_onmousemove();

        showMouse();
        clearTimeout(mouseIdleTimeout);

        mouseIdleTimeout = setTimeout(hideMouse, parameters.timeout);
    };

    function showMouse() {
        style.cursor = defaultCursor;
    };
    function hideMouse() {
        style.cursor = 'none';
    };
})();
