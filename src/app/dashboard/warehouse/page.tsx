"use client"
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import ControlPanel from '@/components/ControlPanel';
import { useCreatePositionMutation, useClearPositionMutation, useGetPositionsQuery } from '@/redux/services/apiSlice';
import { Position } from '@/types';


export default function WarehousePage() {

    const [selectedPositionInfo, setSelectedPositionInfo] = useState<Position | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [positions, setPositions] = useState<Position[]>([]);
    const [loading, setLoading] = useState(true); 

    const containerRef = useRef<HTMLDivElement | null>(null);
    const scene = useRef<THREE.Scene | null>(null);
    const camera = useRef<THREE.PerspectiveCamera | null>(null);
    const renderer = useRef<THREE.WebGLRenderer | null>(null);
    const cubesGroup = useRef<THREE.Group | null>(null);
    const orbitControls = useRef<OrbitControls | null>(null)

    const { data, error, isLoading } = useGetPositionsQuery(null);
    const [ createPosition ] = useCreatePositionMutation()
    const [ clearPosition ] = useClearPositionMutation()


    useEffect(() => {
      if(data){
        setPositions(data)
        console.log(data)
      }
      setLoading(false)
    },[data, error, isLoading]);

    const createStands = (x:number) => {
        if (!scene.current) return;

        for (let i = 1.5; i < 5; i += 1.5) {          
            const standGeometry = new THREE.BoxGeometry(1.5, 0.1, 15);
            const standMaterial = new THREE.MeshStandardMaterial({color: 0x808080, transparent: true, opacity: 0.8 });
            const stand = new THREE.Mesh(standGeometry, standMaterial);
            stand.position.set(x, i, -0.8);
            cubesGroup.current?.add(stand);
        };
        for (let i = -8.3; i < 7; i += 1.5) {          
            const paralGeometry = new THREE.BoxGeometry(1.5, 5.5, 0.1);
            const paralMaterial = new THREE.MeshStandardMaterial({color: 0x808080, transparent: true, opacity: 0.8 });;
            const paral = new THREE.Mesh(paralGeometry, paralMaterial);
            paral.position.set(x, 2.8, i);
            cubesGroup.current?.add(paral);
        };
        if (cubesGroup.current) scene.current.add(cubesGroup.current);
    }

    const createRack = (x:number) => {
        if (!scene.current) return;
        if(cubesGroup.current){
            cubesGroup.current.children.length = 0;
        }
        let positionNumber = 0
        cubesGroup.current = new THREE.Group();
        for (let i = 0.7; i < 6; i += 1.5) {
            for (let j = 6; j > -9; j -= 1.5) {
                const cubeGeometry = new THREE.BoxGeometry(1.5, 1.2, 1);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 128;
                if(ctx){
                    // Cambia el color de fondo
                    const positionInfo = positions[positionNumber];
                    ctx.fillStyle = positionInfo.occupied ? 'red' : 'blue';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = '60px Arial';
                    ctx.fillStyle = 'white';
                    // Cambia el color de la fuente si lo deseas
                    ctx.fillText(positionInfo.position_code, 70, 70);
                    const texture = new THREE.CanvasTexture(canvas);
                    const cubeMaterial = new THREE.MeshStandardMaterial({ map: texture}); // Asigna la textura al material
                    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.position.set( x, i , j);
                    cube.userData.positionInfo = positions[positionNumber];
                    cube.userData.dragable = true;
                    cubesGroup.current.add(cube);
                }
                positionNumber ++;
            }
        };
        createStands(x)
    }

    const showFreeOnes = (x:number) => {
        if (!scene.current) return;
        if(cubesGroup.current){
            cubesGroup.current.children.length = 0;
        }
        let positionNumber = 0
        cubesGroup.current = new THREE.Group();
        for (let i = 0.7; i < 6; i += 1.5) {
            for (let j = 6; j > -9; j -= 1.5) {
                const cubeGeometry = new THREE.BoxGeometry(1.5, 1.2, 1);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 128;
                if(ctx){
                    // Cambia el color de fondo
                    const positionInfo = positions[positionNumber];
                    ctx.fillStyle = positionInfo.occupied ? 'red' : 'blue';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = '60px Arial';
                    ctx.fillStyle = 'white';
                    // Cambia el color de la fuente si lo deseas
                    ctx.fillText(positionInfo.position_code, 70, 70);
                    const texture = new THREE.CanvasTexture(canvas);
                    const cubeMaterial = positionInfo.occupied ? new THREE.MeshStandardMaterial({
                            map: texture,
                            transparent: true,
                            opacity: 0.0, // Cambia la opacidad a 0 para que sea totalmente transparente
                        }) : 
                        new THREE.MeshStandardMaterial({ map: texture}); // Asigna la textura al material
                    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.position.set( x, i , j);
                    cube.userData.positionInfo = positions[positionNumber];
                    cube.userData.dragable = true;
                    cubesGroup.current.add(cube);
                }
                positionNumber ++;
            }
        };
        createStands(x)
    }

    const showOccupiedOnes = (x:number) => {
        if (!scene.current) return;
        if(cubesGroup.current){
            cubesGroup.current.children.length = 0;
        }
        let positionNumber = 0
        cubesGroup.current = new THREE.Group();
        for (let i = 0.7; i < 6; i += 1.5) {
            for (let j = 6; j > -9; j -= 1.5) {
                const cubeGeometry = new THREE.BoxGeometry(1.5, 1.2, 1);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 128;
                if(ctx){
                    // Cambia el color de fondo
                    const positionInfo = positions[positionNumber];
                    ctx.fillStyle = positionInfo.occupied ? 'red' : 'blue';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = '60px Arial';
                    ctx.fillStyle = 'white';
                    // Cambia el color de la fuente si lo deseas
                    ctx.fillText(positionInfo.position_code, 70, 70);
                    const texture = new THREE.CanvasTexture(canvas);
                    const cubeMaterial = positionInfo.occupied ? new THREE.MeshStandardMaterial({ map: texture}) 
                        : new THREE.MeshStandardMaterial({
                            map: texture,
                            transparent: true,
                            opacity: 0.0, 
                        });
                    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.position.set( x, i , j);
                    cube.userData.positionInfo = positions[positionNumber];
                    cube.userData.dragable = true;
                    cubesGroup.current.add(cube);
                }
                positionNumber ++;
            }
        };
        createStands(x)
    }

    const searchByProduct  = (productName: string, x: number) => {
        if (!scene.current) return;
        if(cubesGroup.current){
            cubesGroup.current.children.length = 0;
        }
        let positionNumber = 0
        cubesGroup.current = new THREE.Group();
        for (let i = 0.7; i < 6; i += 1.5) {
            for (let j = 6; j > -9; j -= 1.5) {
                const cubeGeometry = new THREE.BoxGeometry(1.5, 1.2, 1);
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = 256;
                canvas.height = 128;
                if(ctx){
                    // Cambia el color de fondo
                    const positionInfo = positions[positionNumber];
                    ctx.fillStyle = positionInfo.occupied ? 'red' : 'blue';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.font = '60px Arial';
                    ctx.fillStyle = 'white';
                    // Cambia el color de la fuente si lo deseas
                    ctx.fillText(positionInfo.position_code, 70, 70);
                    const texture = new THREE.CanvasTexture(canvas);
                    const cubeMaterial = positionInfo.product_id === Number(productName) ? new THREE.MeshStandardMaterial({ map: texture}) 
                        : new THREE.MeshStandardMaterial({
                            map: texture,
                            transparent: true,
                            opacity: 0.0, 
                        });
                    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
                    cube.position.set( x, i , j);
                    cube.userData.positionInfo = positions[positionNumber];
                    cube.userData.dragable = true;
                    cubesGroup.current.add(cube);
                }
                positionNumber ++;
            }
        };
        createStands(x)
    }

    useEffect(() => {
        if (!loading) {
            if (!containerRef.current) return;
            //Crear escena y camara
            scene.current = new THREE.Scene();
            camera.current = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            renderer.current = new THREE.WebGLRenderer();
            const ambientLight = new THREE.AmbientLight(0xFFF);
            const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 5);
            const directionalLight2 = new THREE.DirectionalLight(0xFFFFFF, 5);
            directionalLight.position.set(10, 7, 50);
            directionalLight2.position.set(-10, 7, 50);
            const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5);
            const gridHelper = new THREE.GridHelper(30);
            orbitControls.current = new OrbitControls(camera.current, renderer.current.domElement); 
            scene.current.add(ambientLight);
            scene.current.add(directionalLight);
            scene.current.add(directionalLight2);
            scene.current.add(directionalLightHelper);
            scene.current.add(gridHelper);
            orbitControls.current.update();
            camera.current.position.set(0, 7, 15);
            const mouse = new THREE.Vector2();
            const raycaster = new THREE.Raycaster();

            // Crear suelo
            const planeGeometry = new THREE.PlaneGeometry(100, 100);
            const planeMaterial = new THREE.MeshBasicMaterial({ color: 0xD3D3D3, side: THREE.DoubleSide });
            const plane = new THREE.Mesh(planeGeometry, planeMaterial);
            scene.current.add(plane);
            plane.rotation.x = Math.PI / 2;

            renderer.current.setSize(window.innerWidth, window.innerHeight);
            if (containerRef.current) {
                containerRef.current.appendChild(renderer.current.domElement);
            }

            const handleCubeClick = (positionInfo: Position) => {
                setSelectedPositionInfo(positionInfo);
                console.log(positionInfo)
                setOpenModal(true);
            };


            window.addEventListener('click', event => {
                mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
                mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

                if (!camera.current || !scene.current) return;

                raycaster.setFromCamera(mouse, camera.current);
                const intersects = raycaster.intersectObjects(scene.current.children); 
                if(intersects.length > 0 && intersects[0].object.userData.dragable){
                    const selectedCube = intersects[0].object as THREE.Mesh;
                    const positionInfo = selectedCube.userData.positionInfo;
                    handleCubeClick(positionInfo);
                };
            });

            // Función para animar el objeto en 3D
            const animate = () => {
                if (renderer.current && scene.current && camera.current) {
                    requestAnimationFrame(animate);
                    renderer.current.render(scene.current, camera.current);
                }
            };
        
            // Inicia la animación
            animate();
        }
    }, [loading]);


    useEffect(() => {
      if(positions.length > 0){
        createRack(-5.5);
      }
    }, [positions]);


    const handleProductSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fomrData = new FormData(e.currentTarget);
        try {
          createPosition({
            product: fomrData.get("product"),
            position: selectedPositionInfo,
          })
          setOpenModal(false);
        } catch (error) {
          console.log(error);
        }
    }


    const handleOccupiedChange = async (position: Position) => {
        position.occupied = false;
        try {
          clearPosition(position)
          setOpenModal(false);
        } catch (error) {
            console.error('Error al actualizar la posición:', error);
        }
    }


    return (
        <div>
            <div ref={containerRef}>
            {openModal && selectedPositionInfo && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50" onClick={(e) => e.stopPropagation()} >
                <div className="modal bg-white p-4 border border-gray-300 shadow-lg">
                    <h2 className="text-xl font-bold mb-4">Editar Información</h2>
                    <form onSubmit={handleProductSubmit} className='bg-neutral-100 px-8 py-10'>
                        <input 
                            type="text" 
                            placeholder='Producto' 
                            name='product'
                            className='bg-zinc-200 px-4 py-2 block mb-2 rounded'
                        />
                        <button className='bg-sky-300 px-4 py-2 block mb-2 rounded'>Agregar producto</button>
                    </form>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={() => handleOccupiedChange(selectedPositionInfo)}
                    >
                        Marcar como Desocupado
                    </button>
                    <p>Position Code: {selectedPositionInfo.position_code}</p>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
                        onClick={() => setOpenModal(false)}
                    >
                        Cerrar Modal
                    </button>
                </div>
                </div>
            )}
            <ControlPanel
                onlyFreeOnes={() => {
                    showFreeOnes(-5.5);
                }}
                onlyOccupied={() => {
                    showOccupiedOnes(-5.5);
                }}
                searchByProduct={ 
                    searchByProduct
                }
                showAll={() =>{
                    createRack(-5.5);
                }}
            />
            </div>
        </div>
    );
}

