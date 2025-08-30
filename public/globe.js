

document.addEventListener('DOMContentLoaded', ()=>{
        //basic scene setup--THREE.js documentation
    const scene = new THREE.Scene()//where we place the objects
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000)//how we view the scene
    const renderer = new THREE.WebGLRenderer({alpha: true})//renders the scene for us

    scene.background = null//makes background transparent   

    //renderer setup
    const globeContainer = document.getElementById('globe-container')    
    renderer.setSize(globeContainer.clientWidth, globeContainer.clientHeight)//fit THREE inside the container only
    camera.aspect = globeContainer.clientWidth / globeContainer.clientHeight//update camera aspect ratio to fit inside container
    camera.updateProjectionMatrix()//update the camera with new aspect ratio
    globeContainer.appendChild(renderer.domElement)//append the renderer to the container .i.e show the scene inside the container



    // Earth geometry & material
    const geometry = new THREE.SphereGeometry(1, 64, 64)//(width, height, widthSegments(vertical slices--more=smoother), heightSegments)
    const timeCheck = new Date().getHours()//gives 0-23hours
    let texture
    if(timeCheck>=6 && timeCheck<=18){
        texture = new THREE.TextureLoader().load('/assets/earthDay.jpg')//loads an image to be used as texture
        globeContainer.style.background = 'linear-gradient(to bottom, #87CEEB, #ffffff)'//day gradient background
    }
    else{
        texture = new THREE.TextureLoader().load('/assets/earthNight.jpg')//loads an image to be used as texture
        globeContainer.style.background = 'linear-gradient(to bottom, #0f2027, #203a43, #2c5364)'//night gradient background
    }
    const material = new THREE.MeshStandardMaterial({ map: texture })//material with texture--reflects light
    const earth = new THREE.Mesh(geometry, material)//actual object combining geometry and material
    scene.add(earth)//add earth to the scene

    // Lighting from a single direction
    const light = new THREE.PointLight(0xffffff, 1)//white light, intensity=1
    light.position.set(5,5,5)//position the light source
    scene.add(light)//add light to the scene
    scene.add(new THREE.AmbientLight(0x404040))//ambient light--soft light from all directions

    // Position camera
    camera.position.z = 3//camera 3 units away from the origin(0,0,0) where the earth is present


    // rotation animation
    function rotation() {
        requestAnimationFrame(rotation)//calls the function again and again--creates a loop
        earth.rotation.y += 0.001//rotate earth on the y-axis like a real earth
        renderer.render(scene, camera)//renders the scene from the perspective of the camera
    }

    rotation()

})




