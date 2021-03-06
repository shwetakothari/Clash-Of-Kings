var Client = (function(window) {
    
      var socket      = null;
      var gameState   = null;
    
      var gameID      = null;
      var playerColor = null;
      var playerName  = null;
    
      var container   = null;
      var messages    = null;
      var board       = null;
      var squares     = null;
    
      var gameClasses = null;
    
      var selection   = null;
    
      var gameOverMessage     = null;
      var pawnPromotionPrompt = null;
      var forfeitPrompt       = null;
      var squareIDs=[];
      var wActive = true;
      var bActive = true;
      var yActive = true;
      var rActive = true;
      var sendButton = null;
      var field = null;
      var wScore = 0;
      var bScore = 0;
      var yScore = 0;
      var rScore = 0;
      var player = null; 


    var State = function() {
        this.state = "Active";
    }
    State.prototype.switch = function() {
        if(this.state === "Active") {
            this.state = "InActive";
        } else {
            this.state = "Active";
        }
    };
    State.prototype.isActiveState = function() {
        if(this.state === "Active") {
            return true;
        } else {
            return false;
        }
    };
    var curState = new State();

      /**
       * Initialize the UI
       */
    var init = function(config) {
        gameID      = config.gameID;
        playerColor = config.playerColor;
        playerName  = config.playerName;
    
        container   = $('#game');
        messages    = $('#messages');
        board       = $('#board');
        sendButton  = $('#submsg');
        field       = $('#text');
        squares     = board.find('.square');
    
        gameOverMessage     = $('#game-over');
        pawnPromotionPrompt = $('#pawn-promotion');
        forfeitPrompt       = $('#forfeit-game');
    
        gameClasses = "white black red orange static pawn rook knight bishop queen king not-moved empty selected " +
                      "valid-move valid-capture valid-en-passant-capture valid-castle last-move";
    
          // Create socket connection
        socket = io.connect();

        // Define board based on player's perspective
        assignSquares();
    
        // Attach event handlers
        attachDOMEventHandlers();
        attachSocketEventHandlers();
        // Initialize modal popup windows
       // gameOverMessage.modal({show: false, keyboard: false, backdrop: 'static'});
       // pawnPromotionPrompt.modal({show: false, keyboard: false, backdrop: 'static'});
       // forfeitPrompt.modal({show: false, keyboard: false, backdrop: 'static'});
    
        // Join game
        socket.emit('join', gameID);
    
            //   Observer Design pattern code
            player = new Player();
            
            
                var log = (function() {
                var log = "";
                return {
                    add: function(msg) { log += msg + "\n"; },
                    show: function() { alert(log); log = ""; }
                }
            })();
                var score = function() { 
                        switch (selection.color) {
                            case 'w':
                                    wScore++;
                                    score_text.textContent= wScore;
                                break;
                            case 'b':
                                    bScore++;
                                    score_text.textContent= bScore;
                                break;
                            case 'y':
                                    yScore++;
                                    score_text.textContent= yScore;
                                break;
                            case 'r':
                                    rScore++;
                                    score_text.textContent= rScore;
                                break;
                            default:
                                break;
                        }
                };

                var score_static  = function() { 
                    switch (selection.color) {
                        case 'w':
                                wScore+=2;
                                score_text.textContent= wScore;
                            break;
                        case 'b':
                                bScore+=2;
                                score_text.textContent= bScore;
                            break;
                        case 'y':
                                yScore+=2;
                                score_text.textContent= yScore;
                            break;
                        case 'r':
                                rScore+=2;
                                score_text.textContent= rScore;
                            break;
                        default:
                            break;
                    }
            };

                
                player.subscribe(score);
                player.subscribe(score_static);
       
    
 };

        var countdownNumberEl = document.getElementById('countdown-number');
        var countdown_svg = document.getElementById('countdown-svg').style;
        var countdown_number = document.getElementById('countdown-number').style;
        var countdown_svg_circle = document.getElementById('countdown-svg-circle').style;
        var timer_text = document.getElementById("timer_text");
        
    
        var score_text = document.getElementById("score_text");

    
      /**
       * Assign square IDs and labels based on player's perspective
       */
    
      var assignSquares = function() {
          var fileLables = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
          var rankLabels = [9, 8, 7, 6, 5, 4, 3, 2, 1, 0];
    
          //Defining Board position for Player 1
          if (playerColor === 'white') {
              for(i=0;i<10;i++){
                  for(j=0;j<26;j++){
                      squareIDs.push(fileLables[j]+rankLabels[i]);
    
                  }
              }
          }
    
    
          //Defining Board position for Player 2
          if (playerColor === 'black') {
    
            fileLables.reverse();
              rankLabels.reverse();
    
              for(i=0;i<10;i++){
                  for(j=0;j<26;j++){
                      squareIDs.push(fileLables[j]+rankLabels[i]);
    
                  }
              }
          }
    
          //Defining Board position for Player 3
          if (playerColor === 'red') {
              fileLables.reverse();
              for(i=0;i<10;i++){
                  for(j=0;j<26;j++){
                      squareIDs.push(fileLables[j]+rankLabels[i]);
    
                  }
              }
         }
    
          //Defining Board position for Player 4
          if (playerColor === 'yellow') {
              rankLabels.reverse();
              for(i=0;i<10;i++){
                  for(j=0;j<26;j++){
                      squareIDs.push(fileLables[j]+rankLabels[i]);
    
                  }
              }
          }
    
          // Set square IDs
          squares.each(function(i) { $(this).attr('id', squareIDs[i]); });
    
          // Set file and rank labels
          $('.top-edge').each(function(i) { $(this).text(fileLables[i]); });
          $('.right-edge').each(function(i) { $(this).text(rankLabels[i]); });
          $('.bottom-edge').each(function(i) { $(this).text(fileLables[i]); });
          $('.left-edge').each(function(i) { $(this).text(rankLabels[i]); });
    
      };
    
      /**
       * Attach DOM event handlers
       */
      var attachDOMEventHandlers = function() {
        // Highlight valid moves for white pieces
        if (playerColor === 'white') {
          container.on('click', '.white.pawn', function(ev) {
            if (gameState.status === 'ongoing' && curState.isActiveState()) {
              highlightValidMoves('wP', ev.target);
            }
          });
          container.on('click', '.white.rook', function(ev) {
              if (gameState.status === 'ongoing' && curState.isActiveState()) {
                  highlightValidMoves('wR', ev.target);
              }
          });
          container.on('click', '.white.knight', function(ev) {
            if (gameState.status === 'ongoing' && curState.isActiveState()) {
              highlightValidMoves('wN', ev.target);
            }
          });
          container.on('click', '.white.bishop', function(ev) {
            if (gameState.status === 'ongoing' && curState.isActiveState()) {
              highlightValidMoves('wB', ev.target);
            }
          });
          container.on('click', '.white.queen', function(ev) {
            if (gameState.status === 'ongoing' && curState.isActiveState()) {
              highlightValidMoves('wQ', ev.target);
            }
          });
          container.on('click', '.white.king', function(ev) {
            if (gameState.status === 'ongoing' && curState.isActiveState()) {
              highlightValidMoves('wK', ev.target);
            }
          });
        }
    
        // Highlight valid moves for black pieces
        if (playerColor === 'black') {
          container.on('click', '.black.pawn',   function(ev) {
            if (gameState.status === 'ongoing' && curState.isActiveState()) {
              highlightValidMoves('bP', ev.target);
            }
          });
          container.on('click', '.black.rook',   function(ev) {
              if (gameState.status === 'ongoing' && curState.isActiveState()) {
                highlightValidMoves('bR', ev.target);
              }
          });
          container.on('click', '.black.knight', function(ev) {
            if (gameState.status === 'ongoing' && curState.isActiveState()) {
                  highlightValidMoves('bN', ev.target);
              }
          });
          container.on('click', '.black.bishop', function(ev) {
            if (gameState.status === 'ongoing' && curState.isActiveState()) {
              highlightValidMoves('bB', ev.target);
            }
          });
          container.on('click', '.black.queen',  function(ev) {
           if (gameState.status === 'ongoing' && curState.isActiveState()) {
              highlightValidMoves('bQ', ev.target);
            }
          });
          container.on('click', '.black.king',   function(ev) {
            if (gameState.status === 'ongoing' && curState.isActiveState()) {
              highlightValidMoves('bK', ev.target);
            }
          });
        }
          // Highlight valid moves for black pieces
          if (playerColor === 'yellow') {
              container.on('click', '.yellow.pawn',   function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('yP', ev.target);
                  }
              });
              container.on('click', '.yellow.rook',   function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('yR', ev.target);
                  }
              });
              container.on('click', '.yellow.knight', function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('yN', ev.target);
                  }
              });
              container.on('click', '.yellow.bishop', function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('yB', ev.target);
                  }
              });
              container.on('click', '.yellow.queen',  function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('yQ', ev.target);
                  }
              });
              container.on('click', '.yellow.king',   function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('yK', ev.target);
                  }
              });
          }
          // Highlight valid moves for black pieces
          if (playerColor === 'red') {
              container.on('click', '.red.pawn',   function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState())
                  {
                      highlightValidMoves('rP', ev.target);
                  }
              });
              container.on('click', '.red.rook',   function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('rR', ev.target);
                 }
              });
              container.on('click', '.red.knight', function(ev) {
                 if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('rN', ev.target);
                  }
              });
              container.on('click', '.red.bishop', function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('rB', ev.target);
                  }
              });
              container.on('click', '.red.queen',  function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('rQ', ev.target);
                  }
              });
              container.on('click', '.red.king',   function(ev) {
                  if (gameState.status === 'ongoing' && curState.isActiveState()) {
                      highlightValidMoves('rK', ev.target);
                  }
              });
          }
    
        // Clear all move highlights
        container.on('click', '.empty', function(ev) {
          clearHighlights();
        });
    
        // Perform a regular move
        container.on('click', '.valid-move', function(ev) {
          var m = move(ev.target);
    
          // Test for pawn promotion
        /*  if (/wP....8/.test(m) || /bP....1/.test(m)||/yP....8/.test(m)||/rP....1/.test(m)) {
            showPawnPromotionPrompt(function(p) {
              // replace piece
              messages.empty();
              socket.emit('move', {gameID: gameID, move: m+p});
            });
          } else {
        */
            messages.empty();
            socket.emit('move', {gameID: gameID, move: m});
       //   }
        });
    
        // Perform a regular capture
        container.on('click', '.valid-capture', function(ev) {
          var m = capture(ev.target);
    
          // Test for pawn promotion
        /*    if (/wP....8/.test(m) || /bP....1/.test(m)||/yP....8/.test(m)||/rP....1/.test(m)) {
            showPawnPromotionPrompt(function(p) {
              // replace piece
              messages.empty();
              socket.emit('move', {gameID: gameID, move: m+p});
            });
          } else {
        */
            messages.empty();
            socket.emit('move', {gameID: gameID, move: m});
        //  }
        });
    
        // Perform an en passant capture
        container.on('click', '.valid-en-passant-capture', function(ev) {
          var m = capture(ev.target);
          messages.empty();
          socket.emit('move', {gameID: gameID, move: m+'ep'});
        });
    
        // Perform a castle
        container.on('click', '.valid-castle', function(ev) {
          var m = castle(ev.target);
          messages.empty();
          socket.emit('move', {gameID: gameID, move: m});
        });
    
        // Forfeit game
        container.on('click', '#forfeit', function(ev) {
          showForfeitPrompt(function(confirmed) {
            if (confirmed) {
              messages.empty();
              socket.emit('forfeit', gameID);
            }
          });
        });
    
        container.on('click','#submit',function(ev){
            console.log("event listened on client.js" );
            socket.emit('chat',{player: playerName, gameID: gameID , msg: field.val()})
            field.val('');
        });
      };
    
      /**
       * Attach Socket.IO event handlers
       */
      var attachSocketEventHandlers = function() {
    
        // Update UI with new game state
        socket.on('update', function(data) {
          console.log(data);
          gameState = data;
          update();
        });
    
        // Display an error
        socket.on('error', function(data) {
          console.log(data);
          showErrorMessage(data);
        });
        socket.on('message',function(data){
              console.log(data,"client");
              updateChatBox(data);
            //  socket.emit('chat', { gameID: gameID, msg: field.value });
        });
    
        socket.on('click','#submsg', function(){
            console.log("click captured");
              messages.empty();
               socket.emit('chat', {  message: field.value,
                   player: playerName});
          });
    
      };
    
    
        /**
       * Highlight valid moves for the selected piece
       */
      var highlightValidMoves = function(piece, selectedSquare) {
        var square = $(selectedSquare);
        var move   = null;
    
        // Set selection object
        selection = {
          color: piece[0],
          piece: piece[1],
          file:  square.attr('id')[0],
          rank:  square.attr('id')[1]
        };
    
        // Highlight the selected square
        squares.removeClass('selected');
        square.addClass('selected');
    
        // Highlight any valid moves
        squares.removeClass('valid-move valid-capture valid-en-passant-capture');
        for (var i=0; i<gameState.validMoves.length; i++) {
          move = gameState.validMoves[i];
    
          if (move.type === 'move') {
            if (move.pieceCode === piece && move.startSquare === square.attr('id')) {
              $('#'+move.endSquare).addClass('valid-move');
            }
          }
    
          if (move.type === 'capture') {
            if (move.pieceCode === piece && move.startSquare === square.attr('id')) {
              if (move.captureSquare === move.endSquare) {
                $('#'+move.endSquare).addClass('valid-capture');
              } else {
                $('#'+move.endSquare).addClass('valid-en-passant-capture');
              }
            }
          }
    
        }
      };
    
      /**
       * Clear valid move highlights
       */
      var clearHighlights = function() {
        squares.removeClass('selected');
        squares.removeClass('valid-move');
        squares.removeClass('valid-capture');
        squares.removeClass('valid-en-passant-capture');
        squares.removeClass('valid-castle');
      };
    
 /**
    Observer Design Pattern where player is a Subject and score is observer
    
    **/
    function Player() {
        this.observers = [];
    }

    Player.prototype = 
    {
        subscribe: function(fn) { // fn is score function which modifies the score 
            
            this.observers.push(fn) ; 
            console.log("i am in subsscribe : " + this.observers[0] );
            console.log("i am in subsscribe : " + this.observers[1] );
        },     

        unsubscribe: function(fn) {

            console.log("i am in Unsubsscribe : " + this.observers[0]);
            
        }, 

        notify: function() {
            console.log("i am in notify"); 
            console.log("i am in notify : " + this.observers[0]);
            this.observers[0]();
            // for lopp over observers array 
          //  this.observers["score"]();
        },

        notify_static: function() {
            console.log("i am in notify"); 
            console.log("i am in notify : " + this.observers[1]);
            this.observers[1]();
            
        },
    }

      /**
       * Move selected piece to destination square
       */
      var move = function(destinationSquare) {
        var piece = selection.color+selection.piece;
        var src   = $('#'+selection.file+selection.rank);
        var dest  = $(destinationSquare);
    
        clearHighlights();
    
        // Move piece on board
        src.removeClass(getPieceClasses(piece)).addClass('empty');
        dest.removeClass('empty').addClass(getPieceClasses(piece));
    
    
        //disable and call timer
          switch (selection.color) {
              case 'w':
                      console.log(selection.color);
                      
                      player.notify();

                      curState.switch();
                      var countdown = 5;
                      countdownNumberEl.textContent = countdown;
                      var timer = setInterval(function() {
                        countdown = --countdown <= 0 ? 5 : countdown;
                        countdownNumberEl.textContent = countdown;
                      }, 1000);
                      countdown_svg.visibility = 'visible';
                      countdown_number.visibility = 'visible';
                      countdown_svg_circle.animationPlayState = 'running';
                      timer_text.textContent= "Wait for 5 seconds before making next move!";

                      setTimeout(function () {
                          curState.switch();
                          timer_text.textContent= "You can move now !!";
                          countdown_svg.visibility ='hidden';
                          countdown_svg_circle.animationPlayState= 'paused';
                          countdown_number.visibility='hidden';
                          clearInterval(timer);
                      }, 5000);
                  break;
              case 'b':
                  console.log(selection.color);
    
                  player.notify();

                  curState.switch();
                  var countdown = 5;
                  countdownNumberEl.textContent = countdown;
                  var timer = setInterval(function() {
                      countdown = --countdown <= 0 ? 5 : countdown;
                      countdownNumberEl.textContent = countdown;
                  }, 1000);
                  countdown_svg.visibility = 'visible';
                  countdown_number.visibility = 'visible';
                  countdown_svg_circle.animationPlayState = 'running';
                  timer_text.textContent= "Wait for 5 seconds before making next move!";

                  setTimeout(function () {
                      curState.switch();
                      timer_text.textContent= "You can move now !!";
                      countdown_svg.visibility ='hidden';
                      countdown_svg_circle.animationPlayState= 'paused';
                      countdown_number.visibility='hidden';
                      clearInterval(timer);
                  }, 5000);
                  break;
              case 'y':
                  console.log(selection.color);
    
                  player.notify();

                  curState.switch();
                  var countdown = 5;
                  countdownNumberEl.textContent = countdown;
                  var timer = setInterval(function() {
                      countdown = --countdown <= 0 ? 5 : countdown;
                      countdownNumberEl.textContent = countdown;
                  }, 1000);
                  countdown_svg.visibility = 'visible';
                  countdown_number.visibility = 'visible';
                  countdown_svg_circle.animationPlayState = 'running';
                  timer_text.textContent= "Wait for 5 seconds before making next move!";
                  setTimeout(function () {
                      curState.switch();
                      timer_text.textContent= "You can move now !!";
                      countdown_svg.visibility ='hidden';
                      countdown_svg_circle.animationPlayState= 'paused';
                      countdown_number.visibility='hidden';
                      clearInterval(timer);
                  }, 5000);
                  break;
              case 'r':
                  console.log(selection.color);
                  player.notify();

                  curState.switch();
                  var countdown = 5;
                  countdownNumberEl.textContent = countdown;
                  var timer = setInterval(function() {
                      countdown = --countdown <= 0 ? 5 : countdown;
                      countdownNumberEl.textContent = countdown;
                  }, 1000);
                  countdown_svg.visibility = 'visible';
                  countdown_number.visibility = 'visible';
                  countdown_svg_circle.animationPlayState = 'running';
                  timer_text.textContent= "Wait for 5 seconds before making next move!";
                  console.log(wActive);
                  setTimeout(function () {
                      curState.switch();
                      timer_text.textContent= "You can move now !!";
                      countdown_svg.visibility ='hidden';
                      countdown_svg_circle.animationPlayState= 'paused';
                      countdown_number.visibility='hidden';
                      clearInterval(timer);
                  }, 5000);
                  break;
              default:
                  break;
          }
    
    
        // Return move string
        return piece+selection.file+selection.rank+'-'+dest.attr('id');
      };
    
      /**
       * Move selected piece to destination square and capture an opponents piece
       */
      var capture = function(destinationSquare) {
          var src   = $('#'+selection.file+selection.rank);
          var dest  = $(destinationSquare);
          var piece = selection.color+selection.piece;
          var destPiece = gameState.board[dest.attr('id')];
          clearHighlights();
    
          // Move piece on board
          src.removeClass(getPieceClasses()).addClass('empty');
          dest.removeClass(gameClasses).addClass(getPieceClasses(selection.color+gameState.board[dest.attr('id')].substring(1,2)));
    
          //disable and call timer
          switch (selection.color) {
              case 'w':
                  console.log(selection.color);
    
                  player.notify_static();

                  curState.switch();
                  var countdown = 5;
                  countdownNumberEl.textContent = countdown;
                  var timer = setInterval(function() {
                      countdown = --countdown <= 0 ? 5 : countdown;
                      countdownNumberEl.textContent = countdown;
                  }, 1000);
                  countdown_svg.visibility = 'visible';
                  countdown_number.visibility = 'visible';
                  countdown_svg_circle.animationPlayState = 'running';
                  timer_text.textContent= "Wait for 5 seconds before making next move!";
                  console.log(wActive);
                  setTimeout(function () {
                      curState.switch();
                      timer_text.textContent= "You can move now !!";
                      countdown_svg.visibility ='hidden';
                      countdown_svg_circle.animationPlayState= 'paused';
                      countdown_number.visibility='hidden';
                      clearInterval(timer);
                  }, 5000);
                  break;
              case 'b':
                  console.log(selection.color);

                  player.notify_static();
                  curState.switch();
                  var countdown = 5;
                  countdownNumberEl.textContent = countdown;
                  var timer = setInterval(function() {
                      countdown = --countdown <= 0 ? 5 : countdown;
                      countdownNumberEl.textContent = countdown;
                  }, 1000);
                  countdown_svg.visibility = 'visible';
                  countdown_number.visibility = 'visible';
                  countdown_svg_circle.animationPlayState = 'running';
                  timer_text.textContent= "Wait for 5 seconds before making next move!";

                  setTimeout(function () {
                      curState.switch();
                      timer_text.textContent= "You can move now !!";
                      countdown_svg.visibility ='hidden';
                      countdown_svg_circle.animationPlayState= 'paused';
                      countdown_number.visibility='hidden';
                      clearInterval(timer);
                  }, 5000);
                  break;
              case 'y':
                  console.log(selection.color);

                  player.notify_static();
                  curState.switch();
                  var countdown = 5;
                  countdownNumberEl.textContent = countdown;
                  var timer = setInterval(function() {
                      countdown = --countdown <= 0 ? 5 : countdown;
                      countdownNumberEl.textContent = countdown;
                  }, 1000);
                  countdown_svg.visibility = 'visible';
                  countdown_number.visibility = 'visible';
                  countdown_svg_circle.animationPlayState = 'running';
                  timer_text.textContent= "Wait for 5 seconds before making next move!";

                  setTimeout(function () {
                      curState.switch();
                      timer_text.textContent= "You can move now !!";
                      countdown_svg.visibility ='hidden';
                      countdown_svg_circle.animationPlayState= 'paused';
                      countdown_number.visibility='hidden';
                      clearInterval(timer);
                  }, 5000);
                  break;
              case 'r':
                  console.log(selection.color);

                  player.notify_static();
                  curState.switch();
                  var countdown = 5;
                  countdownNumberEl.textContent = countdown;
                  var timer = setInterval(function() {
                      countdown = --countdown <= 0 ? 5 : countdown;
                      countdownNumberEl.textContent = countdown;
                  }, 1000);
                  countdown_svg.visibility = 'visible';
                  countdown_number.visibility = 'visible';
                  countdown_svg_circle.animationPlayState = 'running';
                  timer_text.textContent= "Wait for 5 seconds before making next move!";

                  setTimeout(function () {
                      curState.switch();
                      timer_text.textContent= "You can move now !!";
                      countdown_svg.visibility ='hidden';
                      countdown_svg_circle.animationPlayState= 'paused';
                      countdown_number.visibility='hidden';
                      clearInterval(timer);
                  }, 5000);
                  break;
              default:
                  break;
          }
    
          // Return move string
          return piece+selection.file+selection.rank+'x'+dest.attr('id');
      };
    
        /**
       * Update UI from game state
       */
      var update = function() {
        var you, opponent = null;
    
        var container, name, status, captures = null;
    
        // Update player info
        for (var i=0; i<gameState.players.length; i++) {
    
          // Determine if player is you or opponent
          if (gameState.players[i].color === playerColor) {
            you = gameState.players[i];
            container = $('#you');
          }
          else if (gameState.players[i].color !== playerColor) {
            opponent = gameState.players[i];
            container = $('#opponent');
          }
    
          name     = container.find('strong');
          status   = container.find('.status');
          captures = container.find('ul');
    
          // Name
          if (gameState.players[i].color) {
            name.text(gameState.players[i].color);
          }
    
          // Active Status
          container.removeClass('active-player');
          if (gameState.activePlayer && gameState.activePlayer.color === gameState.players[i].color) {
            container.addClass('active-player');
          }
    
          // Check Status
          status.removeClass('label label-danger').text('');
          if (gameState.players[i].inCheck) {
            status.addClass('label label-danger').text('Check');
          }
    
          // Captured Pieces
          captures.empty();
          for (var j=0; j<gameState.capturedPieces.length; j++) {
            if (gameState.capturedPieces[j][0] !== gameState.players[i].color[0]) {
              captures.append('<li class="'+getPieceClasses(gameState.capturedPieces[j])+'"></li>');
            }
          }
        }
    
        // Update board
        for (var sq in gameState.board) {
          $('#'+sq).removeClass(gameClasses).addClass(getPieceClasses(gameState.board[sq]));
        }
      };
    
      /**
       * Display an error message on the page
       */
      var showErrorMessage = function(data) {
        var msg, html = '';
    
        if (data == 'handshake unauthorized') {
          msg = 'Client connection failed';
        } else {
          msg = data.message;
        }
    
        html = '<div class="alert alert-danger">'+msg+'</div>';
        messages.append(html);
      };
    
      /**
       * Display the "Game Over" window
       */
      var showGameOverMessage = function(type) {
        var header = gameOverMessage.find('h2');
    
        // Set the header's content and CSS classes
        header.removeClass('alert-success alert-danger alert-warning');
        switch (type) {
          case 'checkmate-win'  : header.addClass('alert-success').text('Checkmate'); break;
          case 'checkmate-lose' : header.addClass('alert-danger').text('Checkmate'); break;
          case 'forfeit-win'    : header.addClass('alert-success').text('Your opponent has forfeited the game'); break;
          case 'forfeit-lose'   : header.addClass('alert-danger').text('You have forfeited the game'); break;
          case 'stalemate'      : header.addClass('alert-warning').text('Stalemate'); break;
        }
    
        gameOverMessage.modal('show');
      };
    
        /** Display the chat Message on the chat box
         * in the Game page
         */
        var updateChatBox = function(type){
    
            var content = document.getElementById("content");
    
            if(playerName === type.playerName){
                content.innerHTML  += '<li style="width:100%;">' + '<div class="msj macro">' + '<div class="text text-l">' +
                    '<p><strong>you: </strong>'+type.message+'</p>' +
                    '</div>' + '</li>';
            }
            else {
                content.innerHTML  += '<li style="width:100%;">' + '<div class="msj-rta macro">' + '<div class="text text-r">' +
                    '<p><strong>'+type.playerName+': </strong>'+type.message+'</p>' +
                '</div>' + '</li>';
                console.log("There is a with the message:", type);
            }
    
        };
    
        /*sendButton.addEventListener(click,function() {
            if(field.value!=null){
                socket.emit('chat', {
                    message: field.value,
                    player: gameState.playerName
                });
            }
            else{
                alert("please enter some text in box");
            }
    
        });*/
    
    
        /**
       * Display the "Pawn Promotion" prompt
       */
      var showPawnPromotionPrompt = function(callback) {
    
        // Set the pieces' color to match the player's color
        pawnPromotionPrompt.find('label').removeClass('black white').addClass(playerColor);
    
        // Temporarily attach click handler for the Promote button, note the use of .one()
        pawnPromotionPrompt.one('click', 'button', function(ev) {
          var selection = pawnPromotionPrompt.find("input[type='radio'][name='promotion']:checked").val();
          callback('p'+selection);
          pawnPromotionPrompt.modal('hide');
        });
    
        pawnPromotionPrompt.modal('show');
      };
    
      /**
       * Display the "Forfeit Game" confirmation prompt
       */
      var showForfeitPrompt = function(callback) {
    
        // Temporarily attach click handler for the Cancel button, note the use of .one()
        forfeitPrompt.one('click', '#cancel-forfeit', function(ev) {
          callback(false);
          forfeitPrompt.modal('hide');
        });
    
        // Temporarily attach click handler for the Confirm button, note the use of .one()
        forfeitPrompt.one('click', '#confirm-forfeit', function(ev) {
          callback(true);
          forfeitPrompt.modal('hide');
        });
    
        forfeitPrompt.modal('show');
      };
    
      /**
       * Get the corresponding CSS classes for a given piece
       */
      var getPieceClasses = function(piece) {
          switch (piece) {
              case 'bP'  : return 'black pawn';
              case 'bR'  : return 'black rook';
              case 'bN'  : return 'black knight';
              case 'bB'  : return 'black bishop';
              case 'bQ'  : return 'black queen';
              case 'bK'  : return 'black king';
              case 'wP'  : return 'white pawn';
              case 'wR'  : return 'white rook';
              case 'wN'  : return 'white knight';
              case 'wB'  : return 'white bishop';
              case 'wQ'  : return 'white queen';
              case 'wK'  : return 'white king';
              case 'rP'  : return 'red pawn';
              case 'rR'  : return 'red rook';
              case 'rN'  : return 'red knight';
              case 'rB'  : return 'red bishop';
              case 'rQ'  : return 'red queen';
              case 'rK'  : return 'red king';
              case 'sP'  : return 'static pawn';
              case 'sR'  : return 'static rook';
              case 'sN'  : return 'static knight';
              case 'sB'  : return 'static bishop';
              case 'sQ'  : return 'static queen';
              case 'sK'  : return 'static king';
              case 'yP'  : return 'yellow pawn';
              case 'yR'  : return 'yellow rook';
              case 'yN'  : return 'yellow knight';
              case 'yB'  : return 'yellow bishop';
              case 'yQ'  : return 'yellow queen';
              case 'yK'  : return 'yellow king';
              default    : return 'empty';
          }
      };
    
      return init;
    
    }(window));