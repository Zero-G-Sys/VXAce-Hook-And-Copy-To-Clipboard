(function () {
    const encounterMultiplier = 2;
    const extraMultiplier = 1.25; // Default: 1.25 ; Add 25% extra to exp, gold and drops as we upped the min encounter rate

    Game_Player.prototype.makeEncounterCount = function() {
        var n = $gameMap.encounterStep() * encounterMultiplier; // $gameMap.encounterStep() normally is 60

        // Using Math.randomInt(min, max)
        // Add a minimum steps of (n/2 * 2) + 1
        let steps = Math.floor((Math.randomInt(n/2, n) * 2) + 1);
        // Turns out that nwjs version of randomInt is broken, so add manually a min
        this._encounterCount = steps < n/2 ? Math.floor(n/2) : steps;
    };

    // Add more experience to compensate the less encounter rate
    const expMultiplier = encounterMultiplier * extraMultiplier;
    var ZERO_BattleManager_gainExp = BattleManager.gainExp;
    BattleManager.gainExp = function() {
        this._rewards.exp = Math.floor(this._rewards.exp * expMultiplier);
        ZERO_BattleManager_gainExp.call(this);
    };

    // Add more gold
    const goldMultiplier = encounterMultiplier * extraMultiplier;
    var ZERO_BattleManager_gainGold = BattleManager.gainGold;
    BattleManager.gainGold = function() {
        this._rewards.gold = Math.floor(this._rewards.gold * goldMultiplier);
        ZERO_BattleManager_gainGold.call(this);
    };

    // Double drop rate
    Game_Enemy.prototype.dropItemRate = function() {
        return $gameParty.hasDropItemDouble() ? 4 : 2;
    };

    // Another more precise way is to lower the di.denominator (never less than 1)
    // an enemy with 1/6 drop rate will have a di.denominator of 6
    // Game_Enemy.prototype.makeDropItems = function() {
    //     return this.enemy().dropItems.reduce(function(r, di) {
    //         if (di.kind > 0 && Math.random() * di.denominator < this.dropItemRate()) {
    //             return r.concat(this.itemObject(di.kind, di.dataId));
    //         } else {
    //             return r;
    //         }
    //     }.bind(this), []);
    // };

    // For RJ222134
    // Make escape ratio be a minimum of 90%
    BattleManager.makeEscapeRatio = function() {
        this._escapeRatio = Math.max(0.9, 0.5 * $gameParty.agility() / $gameTroop.agility());
    };

    // Disable battle start animation (Not used as it fucks up with the battle background)
    //Scene_Map.prototype.startEncounterEffect = function() {};

    // Shorten battle start animation (Can't be shorter or it also fucks upd the background)
    Scene_Map.prototype.encounterEffectSpeed = function() {
        return 20;
    };
})();