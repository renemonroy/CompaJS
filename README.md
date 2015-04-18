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