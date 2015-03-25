(function(win, doc) {
  'use strict';

  var compas = win.compas || {};

  win.Compa = function(compaName) {
    var configCompa;
    
    var Class = function() {
      this.init.apply(this, arguments);
    };
    
    Class.className = compaName;
    Class.prototype = {
      constructor : Class,
      children : [],
      init : function(config) {
        for ( var prop in config ) {
          this[prop] = config[prop];
        }
        if ( this.el == null ) {
          var tmp = doc.createElement('div');
          tmp.innerHTML = this.constructor.html || '<div></div>';
          this.el = tmp.firstChild;
          tmp = null;
        }
        if ( this.hasOwnProperty('className') === true ) {
          this.addClass(this.className);
        }
        if ( this.onStart ) this.onStart();
      },
      appendChild : function(child) {
        if ( child.parent ) child.parent.removeChild(child);
        if ( !this.hasOwnProperty('children') ) this.children = [];
        this.children.push(child);
        this[child.name] = child;
        child.setParent(this);
        return child;
      },
      removeChild : function(child) {
        var pos = this.children.indexOf(child);
        if ( pos !== -1 ) {
          this.children.splice(pos, 1);
          delete this[child.name];
          child.parent = null;
        }
        return child;
      },
      getPreviousSibling : function() {
        if ( typeof this.parent === 'undefined' ) return;
        if ( this.parent.children[0] === this ) return;
        return this.parent.children[this.parent.children.indexOf(this) - 1];
      },
      getNextSibling : function() {
        if ( typeof this.parent === 'undefined' ) return;
        if ( this.parent.children[this.parent.children.length - 1] === this ) return;
        return this.parent.children[this.parent.children.indexOf(this) + 1];
      },
      setParent : function(parent) {
        this.parent = parent;
        return this;
      },
      hasClass : function(cl) {
        return this.el.className.match(new RegExp('(^|\\s+)' + cl + '(\\s+|$)'));
      },
      addClass : function(cl) {
        if ( !this.hasClass(this.el, cl) ) this.el.className += ' ' + cl;          
        return this;
      },
      removeClass : function(cl) {
        if ( this.hasClass(cl) ) {
          var reg = new RegExp('(^|\\s+)' + cl + '(\\s+|$)');
          this.el.className = this.el.className.replace(reg, ' ');
        }
        return this;
      },
      replaceClass : function(oldCl, newCl) {
        if ( this.hasClass(oldCl) ) this.removeClass(oldCl).addClass(newCl);
        return this;
      },
      getElByClass : function (className) {
        var descendants = this.el.getElementsByTagName('*'), i=-1, e, result=[];
        while (e=descendants[++i]) {
          ((' '+(e['class']||e.className)+' ').indexOf(' '+className+' ') > -1) && result.push(e);
        }
        return result;
      },
      disable : function() {
        if ( this.onBeforeDisable ) this.onBeforeDisable();
        this.disabled = true;
        this.addClass('disable');
        if ( this.onDisable ) this.onDisable();
        return this;
      },
      enable : function() {
        this.disabled = false;
        this.removeClass('disable');
        return this;
      },
      destroy : function() {
        var childrenLength;
        if ( this.onBeforeDestroy ) this.onBeforeDestroy();
        if ( this.el ) this.el.remove();
        if ( this.children !== null ) {
          childrenLength = this.children.length;
          while ( childrenLength > 0 ) {
            this.children[0].destroy();
            if ( this.children.length === childrenLength ) {
              this.children.shift();
            }
            childrenLength--;
          }
        }
        if ( this.parent ) this.parent.removeChild(this);
        this.children = null;
        this.el = null;
        return null;
      },
      render : function(el, pos) {
        switch (pos) {
          case 'beforebegin' :
            el.parentNode.insertBefore(this.el, el);
            break;
          default :
            el.appendChild(this.el);
            break;
        }
        if ( this.onRender ) this.onRender();
        return this;
      }
    };

    configCompa = function(definition) {
      var defPrototype = definition.prototype;
      if ( defPrototype ) {
        for ( var i in defPrototype ) {
          if ( defPrototype.hasOwnProperty(i) ) {
            Class.prototype[i] = defPrototype[i];
          }
        }
        delete definition.prototype;
      }
      for (var j in definition) {
        if (definition.hasOwnProperty(j)) {
          Class[j] = definition[j];
        }
      }
      compa[compaName] = Class;
      return Class;
    };
    return configCompa;
  };

})(window, document);