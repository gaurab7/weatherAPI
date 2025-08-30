let isRotating = true
let earth
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
    earth = new THREE.Mesh(geometry, material)//actual object combining geometry and material
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
        if(isRotating){
            //only keep rotating if isRotating is true-- toggleRotation will change this value
             earth.rotation.y += 0.005//rotate earth on the y-axis like a real earth
        }
        renderer.render(scene, camera)//renders the scene from the perspective of the camera
    }

    rotation()

})

//convert the longitude and latitude from the data to coordinates on the globe
export function degtoRad(deg) {
    return deg * (Math.PI / 180)
}

export function latLongTo3D(lat, lon, radius, height) {
    const Lat = degtoRad(lat)
    const Lon = degtoRad(lon)
    //formula i got from the internet
    //converts lat,long to x,y,z coordinates on the sphere
    const x = radius * Math.cos(Lat) * Math.cos(Lon)
    const y = radius * Math.sin(Lat)
    const z = radius * Math.cos(Lat) * Math.sin(Lon)
    //returing the coordinates in JSON format
    return { x: x, y: y, z: z }
}

//everyting after getting the coordinates is done in client.js 
export function toggleRotation(state){
    isRotating = state
}

export function changeViewToCoords(lon, lat){
    //to just rotate the globe to the coords we dont need precise coords
    //lon and lat are angles and angels stay the same no matter the radius of the sphere
    //so we can use the lon and lat of earth for our puny globe as well as they are angles
    const Lon = degtoRad(lon)
    const Lat = degtoRad(lat)
    /* to make the location on globe face the user/camera,
    we need to change its rotation(x,y,z) */
    earth.rotation.set(0,0,0)//eset
    earth.rotation.set(
        Lat,
        -Lon+80,
        0
    )
}


