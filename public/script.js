document.addEventListener('DOMContentLoaded', function(){
    const loginForm=document.getElementById('loginForm');
    if(loginForm){
        loginForm.addEventListener('submit', async function(e){
            e.preventDefault();
            const user=document.getElementById('username').value;
            const pass=document.getElementById('password').value;
            const res=await fetch('/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:user,password:pass})});
            const data=await res.json();
            const message=document.getElementById('loginMessage');
            if(data.success){message.style.color='green'; message.textContent='Login exitoso'; window.location.href='admin.html';}
            else{message.style.color='red'; message.textContent='Usuario o contraseña incorrectos';}
        });
    }

    // Cargar cursos en cursos.html y admin.html
    const cardsContainer=document.getElementById('cards-container');
    const listaCursos=document.getElementById('listaCursos');

    async function loadCursos(){
        const res=await fetch('/api/cursos');
        const cursos=await res.json();
        if(cardsContainer){cardsContainer.innerHTML=''; cursos.forEach(c=>{
            const card=document.createElement('div'); card.className='card';
            card.innerHTML=`<h3>${c.titulo}</h3><p>${c.descripcion}</p><a href="${c.archivo}" download class="btn">Descargar</a>`;
            cardsContainer.appendChild(card);
        });}
        if(listaCursos){listaCursos.innerHTML=''; cursos.forEach((c,i)=>{
            const li=document.createElement('li'); li.textContent=`${c.titulo} - ${c.archivo}`;
            listaCursos.appendChild(li);
        });}
    }
    loadCursos();

    // Subir archivo desde admin
    const agregarBtn=document.getElementById('agregarCurso');
    if(agregarBtn){
        agregarBtn.addEventListener('click', async ()=>{
            const titulo=document.getElementById('cursoTitulo').value;
            const desc=document.getElementById('cursoDescripcion').value;
            const archivoInput=document.getElementById('cursoArchivo');
            if(titulo && desc && archivoInput.files.length>0){
                const formData=new FormData(); formData.append('file',archivoInput.files[0]);
                const res=await fetch('/upload',{method:'POST', body: formData});
                const data=await res.json();
                if(data.success){
                    await fetch('/api/cursos',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({titulo,descripcion:desc,archivo:'materiales/'+data.filename})});
                    alert('Curso agregado con éxito'); loadCursos();
                }
            } else { alert('Rellena todos los campos'); }
        });
    }
});