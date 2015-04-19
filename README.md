# compa.js
Class system to build UI components for projects were code needs to be small (like embeddable widgets). Inspired on Neon DSL.

## Usage
Build your component class:

```javascript
  Compa('Movie')({
    html : '<div class="item">' +
        '<p>' +
          '<strong class="title"></strong> - <em class="year"></em>' +
        '</p>' + 
      '</div>',
    prototype : {
      title : null,
      year : null,
      onStart : function() {
        this.titleEl = this.getElByClass('title')[0];
        this.yearEl = this.getElByClass('year')[0];
        if ( this.title ) this.updateTitle(this.title);
        if ( this.year ) this.updateYear(this.year);
      },
      updateTitle : function(str) {
        this.titleEl.textContent = str;
      },
      updateYear : function(str) {
        this.yearEl.textContent = str;
      }
    }
  });
```

You can append children components into a parent one:

```javascript
  Compa('MoviesList')({
    html : '<div class="items-list"></div>',
    prototype : {
      reqUrl : null,
      onStart : function() {
        console.log('>>> ItemsList component started...');
        this._buildMovies();
      },
      _buildMovies : function() {
        var compa = this,
          frag = doc.createDocumentFragment();
        this.movies.forEach( function(movie) {
          var myMovie = compa.appendChild( new UI.Movie({
            title : movie.title,
            year : movie.year
          }));
          frag.appendChild(myMovie.el);
        });
        compa.el.appendChild(frag);
      },
      onRender : function() {
        console.log('>>> ItemsList component rendered...');
      }
    }
  });
```

Then instantiate the component as you want to use:

```javascript
  win.moviesListInstance = new UI.MoviesList({
    movies : moviesData
  }).render(doc.getElementById('wrapper'));
```

Here you can see `moviesListInstance` on console and then check its children
through `moviesListInstance.children`.

## Api

*appendChild* - Function to append a new component as child of the current.
*removeChild* - Destroys a component and removes it from parent.
*getPreviousSibling* - You can get a prev sibling if component is a child.
*getNextSibling* - Gets next sibling component.
*setParent* - This is used automatically as reference when a component is appended.
*hasClass* - Check if the element of the component has a specified class.
*addClass* - Adds a style class to the component element.
*removeClass* - Remove a style clase frome the element of the component.
*replaceClass* - Changes the name of class that already exists.
*getElByClass* - Returns a DOM element found inside the HTML of the component.
*disable* - Adds a class `disabled` to the HTML of the component and sets to true on the disbled flag.
*enable* - Removes the class `disabled` to the HTML of the component and sets to false to the disabled flag.
*destroy* - Deletes the component as well its DOM element and its children components.
*render* - Appends the component element into DOM node specified.
*init* - It configures the component on the constructor with initial values. You don't need to execute this.

## Events

*onStart* - Its executed everytime the init is triggered (when is instantiated).
*onRender* - Its dispatched after the component element is appended to a HTML node.
*onBeforeDisable* - Triggered before disabling a component.
*onDisable* - Triggered after disabling the component.
*onBeforeEnable* - Dispatched before enabling a component.
*onEnable* - Dispatched after enabling a component.
*onBeforDestroy* - Triggered right before deleting a component and its children.

## Prototype Variables
These are options to configure on the instantiation.
*className* - Saves the name as css class if added.
*el* - (Optional) Its the HTML of the component. This is added in the component creation.

## Accessible Variables
All of these shouldn't be changed manually.
*children* - Array of components appended.
*parent* - Reference of the parent component if current is a child.
*disabled* - Flag to know if the component is disabled.