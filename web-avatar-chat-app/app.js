// Three.js 3D avatar rendering integration

let scene, camera, renderer, avatarModel;

function initThreeJS() {
  const avatarDisplay = document.getElementById('avatarDisplay');
  avatarDisplay.textContent = ''; // Clear placeholder text

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, avatarDisplay.clientWidth / avatarDisplay.clientHeight, 0.1, 1000);
  camera.position.set(0, 1.5, 3);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(avatarDisplay.clientWidth, avatarDisplay.clientHeight);
  avatarDisplay.appendChild(renderer.domElement);

  // Remove grid helper to avoid confusion
  // const gridHelper = new THREE.GridHelper(10, 10);
  // scene.add(gridHelper);

  // Add ambient light for better model visibility
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Add directional light for shadows and depth
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(0, 10, 10);
  scene.add(directionalLight);

  window.addEventListener('resize', onWindowResize);

  animate();
}

function onWindowResize() {
  const avatarDisplay = document.getElementById('avatarDisplay');
  camera.aspect = avatarDisplay.clientWidth / avatarDisplay.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(avatarDisplay.clientWidth, avatarDisplay.clientHeight);
}

function animate() {
  requestAnimationFrame(animate);
  if (avatarModel) {
    avatarModel.rotation.y += 0.01;
  }
  renderer.render(scene, camera);
}

function loadAvatarModel(url) {
  const loader = new THREE.GLTFLoader();
  loader.load(
    url,
    function (gltf) {
      if (avatarModel) {
        scene.remove(avatarModel);
      }
      avatarModel = gltf.scene;
      avatarModel.position.set(0, 0, 0);
      scene.add(avatarModel);
    },
    undefined,
    function (error) {
      console.error('Error loading 3D model:', error);
    }
  );
}

const rpmIframe = document.getElementById('rpmIframe');
const openAvatarCreatorBtn = document.getElementById('openAvatarCreatorBtn');
const avatarDisplay = document.getElementById('avatarDisplay');

openAvatarCreatorBtn.addEventListener('click', () => {
  rpmIframe.style.display = 'block';
  avatarDisplay.style.display = 'none';
});

// Listen for messages from Ready Player Me iframe
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://readyplayer.me') return;

  const data = event.data;
  if (data.source === 'readyplayerme' && data.eventName === 'avatarExported') {
    const avatarUrl = data.data.url;
    rpmIframe.style.display = 'none';
    avatarDisplay.style.display = 'block';
    avatarDisplay.textContent = 'Loading avatar...';

    // Initialize Three.js and load the avatar model from the URL
    initThreeJS();
    loadAvatarModel(avatarUrl);
  }
});

document.getElementById('sendChatBtn').addEventListener('click', () => {
  const chatInput = document.getElementById('chatInput');
  const message = chatInput.value.trim();
  if (!message) return;

  const chatWindow = document.getElementById('chatWindow');

  // Append user message
  const userMsg = document.createElement('div');
  userMsg.className = 'text-right mb-2';
  userMsg.textContent = message;
  chatWindow.appendChild(userMsg);

  chatInput.value = '';
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Placeholder for chatbot response
  const botMsg = document.createElement('div');
  botMsg.className = 'text-left mb-2 text-gray-700 italic';
  botMsg.textContent = 'Avatar is thinking...';
  chatWindow.appendChild(botMsg);
  chatWindow.scrollTop = chatWindow.scrollHeight;

  // Simulate chatbot response delay
  setTimeout(() => {
    botMsg.textContent = 'Hello! This is a placeholder response from your avatar.';
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }, 2000);
});
