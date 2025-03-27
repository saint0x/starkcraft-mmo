import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { PATHS } from '../core/Constants.js';

export class AssetManager {
    constructor() {
        this.loadingManager = new THREE.LoadingManager();
        this.fbxLoader = new FBXLoader(this.loadingManager);
        this.assets = new Map();
        this.animations = new Map();
        this.setupLoadingManager();
    }

    setupLoadingManager() {
        this.loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {
            const progress = (itemsLoaded / itemsTotal) * 100;
            this.updateLoadingScreen(progress);
        };

        this.loadingManager.onError = (url) => {
            console.error('Error loading:', url);
            this.showRetryButton();
        };
    }

    updateLoadingScreen(progress) {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            const progressBar = loadingScreen.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = `${progress}%`;
            }
        }
    }

    showRetryButton() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            const retryButton = document.createElement('button');
            retryButton.textContent = 'Retry Loading';
            retryButton.onclick = () => {
                retryButton.remove();
                this.loadAllAssets();
            };
            loadingScreen.appendChild(retryButton);
        }
    }

    removeLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        if (loadingScreen) {
            loadingScreen.remove();
        }
    }

    async loadCharacterModel() {
        try {
            const model = await this.fbxLoader.loadAsync(PATHS.CHARACTER.MODEL);
            this.assets.set('character', model);
            return model;
        } catch (error) {
            console.error('Error loading character model:', error);
            throw error;
        }
    }

    async loadAnimation(name, filename) {
        try {
            const animation = await this.fbxLoader.loadAsync(PATHS.CHARACTER.ANIMATIONS + filename);
            if (animation.animations.length > 0) {
                this.animations.set(name, animation.animations[0]);
                return animation.animations[0];
            }
            throw new Error(`No animations found in ${filename}`);
        } catch (error) {
            console.error(`Error loading animation ${name}:`, error);
            throw error;
        }
    }

    async loadAllAnimations() {
        const animationPromises = Object.entries(PATHS.CHARACTER.ANIMATIONS_LIST).map(
            ([name, filename]) => this.loadAnimation(name, filename)
        );
        return Promise.all(animationPromises);
    }

    async loadAllAssets() {
        try {
            await this.loadCharacterModel();
            await this.loadAllAnimations();
            this.removeLoadingScreen();
            return {
                character: this.assets.get('character'),
                animations: this.animations
            };
        } catch (error) {
            console.error('Error loading assets:', error);
            throw error;
        }
    }

    getAnimation(name) {
        return this.animations.get(name);
    }

    getAllAnimations() {
        return Array.from(this.animations.values());
    }
} 