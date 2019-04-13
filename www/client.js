window.onload = function() {
    //Make connection
    const socket = io('http://localhost:4000');
    //query DOM
    var output = document.getElementById('output')
    var feedback = document.getElementById('feedback');
    var password = document.getElementById('password');
    var message = document.getElementById('message');
    var send = document.getElementById('send');
    var login = document.getElementById('login');
    var user_email = document.getElementById('user_email');
    var status = document.getElementById('status');

    var signUp_link = document.getElementById('signUp_link');
    var signupbtn = document.getElementById('signupbtn');
    var signUP_email = document.getElementById('signUP_email');
    var signUP_password = document.getElementById('signUP_password');
    var signUP_confirm_password = document.getElementById('signUP_confirm_password');
    var signup_userName = document.getElementById('signup_userName');
    var handle = user_email.value;
    var USERNAME;
    //Emit event

    signupbtn.addEventListener('click', (e) => {
        console.log(signUP_confirm_password.value, signUP_password.value);
        if (signUP_confirm_password.value === signUP_password.value) {
            socket.emit('signUpUser', {
                userName: signup_userName.value,
                email: signUP_email.value,
                password: signUP_password.value
            });
        } else {
            socket.emit('signup_not_verified', { message: "Password doesnot match" });
        }
    });

    signUp_link.addEventListener('click', (e) => {
        $('.change').css('display', 'none');
        document.getElementById('signUp_window').style.display = "block";
        user_email.innerHTML = "";
        password.innerHTML = "";
    })

    login.addEventListener('click', (e) => {
        e.preventDefault();
        handle = user_email.value;
        pass = password.value;
        socket.emit('logInUser', {
            email: handle,
            pass: pass
        });
    });

    send.addEventListener('click', (e) => {
        e.preventDefault();
        socket.emit('chat', {
            // handle: handle.value,
            handle: USERNAME,
            message: message.value
        });
        //handle.value = '';
        message.value = '';
    });
    message.addEventListener('keydown', () => {
        console.log('key presss down');
        socket.emit('typing_on', {
            // handle: handle.value
            handle: USERNAME
        });

    });
    message.addEventListener('keyup', () => {

        setTimeout(() => {
            socket.emit('typing_off', {
                // handle: handle.value
            });
        }, 2000)
    });

    socket.on('alert', (data) => {
        console.log('alert event emitted');
        alert(data.message);
    });

    //Listene to data

    socket.on('chat', (data) => {
        output.innerHTML += `<p><strong>${data.handle}</strong> :${data.message}</p>`
        feedback.innerHTML = '';
    });

    socket.on('typing_on', (data) => {
        feedback.innerHTML = '';
        feedback.innerHTML += `<p><em>${data.handle} is typing message...</em></p>`;
    });

    socket.on('typing_off', (data) => {
        feedback.innerHTML = '';
        //feedback.innerHTML += `<p><em>${data.handle} is typing message...</em></p>`;
    });
    socket.on('add user', (data) => {

        status.innerHTML = "" + data;
        setTimeout(() => {

            status.innerHTML = "";
        }, 2000);
    });

    socket.on('disconnect', (data) => {

        status.innerHTML = "" + data;
        setTimeout(() => {

            status.innerHTML = "";
        }, 2000);
        console.log('you have been disconnected');
    });

    socket.on('signup_verified', (data) => {
        status.innerHTML = "Registered";
        //feedback.innerHTML = `User ${data.signup_userName} registered`
    });

    socket.on('successful_login', (data) => {
        socket.emit('add user', data.userName);
        output.innerHTML = '';
        $('.change1').css('display', 'block');
        USERNAME = data.userName;
        send.style.visibility = "visible";
        message.style.visibility = "visible";

    });
}