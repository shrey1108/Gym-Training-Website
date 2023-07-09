$(function()
{
    var app_cover = $('#app-cover'), inp = $('.inp'), prevAction = $('#prev-action-btn'), nextAction=$('#next-action-btn'), stepComplete = false, progress = $('#progress'), timeOut = null,  stepNumber = 1, lastCompletedStep=0, totalSteps = stepsArr.length;

    // added new
    $(document).on('keydown', function(event) {
        if (event.keyCode === 13) {
            var _this = $(this), regex, index = stepNumber - 1, _val = _this.val().trim();
            if (nextAction.hasClass('active') &&  stepsArr[index] != 'password') {
                moveToNextStep();
            }
            else{
                if (stepsArr[index] === 'password') {
                    alert("please confirm your password and click on next arrow to create the account");  
                }
                else{
                    if(stepsArr[index] === 'email'){
                        loginEmail.setCustomValidity("Please include @ and send proper");
                        loginEmail.reportValidity();
                        return false;
                    }
                }
            }
        }
    });

    function checkApp()
    {
        if( stepNumber > 1 )
            return;

        var active = false;
        inp.each(function()
        {
            if( $(this).val().trim().length > 0 )
                active = true;
        });

        if( active )
            app_cover.addClass('active');
        else
        {
            app_cover.removeClass('active');
            inp.parent('div').removeClass('active');
        }
    }

    function _a()
    {
        nextAction.addClass('active');
        stepComplete = true;
        if( lastCompletedStep < stepNumber )
            lastCompletedStep = stepNumber;
    }

    function _b()
    {
        nextAction.removeClass('active');
        stepComplete = false;
    }

    function checkInput()
    {
    
        var _this = $(this), regex, index = stepNumber - 1, _val = _this.val().trim();
        if( stepsArr[index] == 'email' )
        {
            regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            if(regex.test(_val))
                _a();
            else
                _b();
        }
        else if( stepsArr[index] == 'username' )
        {
            clearTimeout(timeOut);
            timeOut = setTimeout(function()
            {
                if( _val.length > 5 )
                    _a();
                else
                    _b();
                    
            },500);
        }
        else if( stepsArr[index] == 'password' )
        {
            if(_val.length >= 5)
                _a();
            else
                _b();
        }
    }

    function clearForm()
    {
        inp.val('');
        $('.inp-box').removeClass('active inactive');
        nextAction.removeClass('active');
        prevAction.removeAttr('class');
        nextAction.removeAttr('class');
    }

    function moveToPreviousStep()
    {
        --stepNumber;

        if(stepNumber < 1)
        {
            stepNumber = 1;
            prevAction.removeClass('active');
            return;
        }
        else
        {
            if(stepNumber == 1)
                prevAction.removeClass('active');

            if( stepNumber <= lastCompletedStep )
                stepComplete = true;

            nextAction.addClass('active');

            progress.width( (((stepNumber-1)/totalSteps)*100)+'%');
            $('#'+stepsArr[stepNumber]).removeClass('active');
            $('#'+stepsArr[stepNumber - 1]).removeClass('inactive');
        }
    }

    function moveToNextStep()
    {
        if(stepComplete && ($('#'+stepsArr[stepNumber - 1]).find('.inp').val().trim().length > 0) )
        {
            progress.width( ((stepNumber/totalSteps)*100)+'%');

            prevAction.addClass('active');

            if( stepNumber == totalSteps )
            {
                setTimeout(function()
                {
                    $('#progress-bar-cover').addClass('hide-form');

                    $('#working').fadeIn(0);

                    setTimeout(function()
                    {
                        $('#working').addClass('inactive');
                        clearForm();
                    },2300);

                    setTimeout(function()
                    {
                        $('#acc-success').addClass('active');
                    },3300);

                },500);

                return;    
            }

            $('#'+stepsArr[stepNumber-1]).addClass('inactive');
            $('#'+stepsArr[stepNumber]).addClass('active');

            if( stepNumber > lastCompletedStep )
            {
                lastCompletedStep = stepNumber;
                stepComplete = false;
            }

            ++stepNumber; // Now on next step     
        
            if( (stepNumber <= lastCompletedStep) && ($('#'+stepsArr[stepNumber - 1]).find('.inp').val().trim().length > 0)  )
                nextAction.addClass('active');
            else
                nextAction.removeClass('active');
        }
    }
      
    app_cover.hover( function()
    { 
        var f_elm = $('#'+stepsArr[0]); 
        if( ! $(this).hasClass('active') )
        {
            $(this).addClass('active');
            f_elm.addClass('active');
            setTimeout(function(){ f_elm.find('input').focus(); },1205);
            stepNumber = 1;
            lastCompletedStep = 0;
            stepComplete = false;
        }
    }, 
    function()
    { 
        checkApp();
    });

    inp.on('keyup',checkInput);

    prevAction.on('click', moveToPreviousStep);
    nextAction.on('click', moveToNextStep);
  


});