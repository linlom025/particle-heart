const canvas = document.getElementById('heartCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 5000; // 增加粒子数量以达到"超级多"的效果
const heartScale = 15; // 控制爱心的大小
const centerX = canvas.width / 2;
const centerY = canvas.height / 2 - 50; // 将爱心稍微向上移动一点

// 爱心参数方程
function heartX(t) {
    return 16 * Math.pow(Math.sin(t), 3);
}

function heartY(t) {
    return -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
}

class Particle {
    constructor(targetX, targetY) {
        this.x = centerX + (Math.random() - 0.5) * canvas.width * 0.8; // 初始 x 位置随机分布在屏幕较宽区域
        this.y = centerY + (Math.random() - 0.5) * canvas.height * 0.8; // 初始 y 位置随机分布在屏幕较高区域
        this.targetX = targetX;
        this.targetY = targetY;
        this.size = Math.random() * 1.5 + 0.5; // 粒子大小
        this.speed = Math.random() * 0.05 + 0.02; // 向目标移动的速度
        this.angle = Math.random() * Math.PI * 2; // 用于流动的角度
        this.velocity = Math.random() * 0.5 + 0.1; // 流动速度
        this.color = `hsl(${Math.random() * 60 + 300}, 100%, ${Math.random() * 50 + 50}%)`; // 粉色/紫色系
    }

    update() {
        // 向目标点移动
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        this.x += dx * this.speed;
        this.y += dy * this.speed;

        // 添加流动效果（围绕目标点小范围随机运动）
        this.angle += Math.random() * 0.1 - 0.05;
        this.x += Math.cos(this.angle) * this.velocity;
        this.y += Math.sin(this.angle) * this.velocity;

        // 限制粒子稍微超出爱心形状一点范围，然后慢慢拉回
        const distToTarget = Math.sqrt(dx * dx + dy * dy);
        if (distToTarget > 50) { // 如果偏离目标太远，增加向目标移动的速度
             this.x -= dx * this.speed * 0.1;
             this.y -= dy * this.speed * 0.1;
        }

    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function init() {
    particlesArray = [];
    // 生成爱心形状上的点作为目标点
    for (let i = 0; i < numberOfParticles; i++) {
        const t = Math.random() * 2 * Math.PI; // 随机角度
        // 在爱心轮廓附近随机分布
        const deviation = Math.random() * 0.9 + 0.1; // 随机偏离度，使粒子不完全在一条线上
        const targetX = centerX + heartX(t) * heartScale * deviation;
        const targetY = centerY + heartY(t) * heartScale * deviation;
        particlesArray.push(new Particle(targetX, targetY));
    }
}

function animate() {
    // 使用带有透明度的绘制来创建拖尾效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; // 调整 alpha 值可以改变拖尾长度
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
    }
    requestAnimationFrame(animate);
}

init();
animate();

// 窗口大小改变时重新初始化
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    // 更新中心点
    centerX = canvas.width / 2;
    centerY = canvas.height / 2 - 50;
    init(); // 重新生成粒子到新的中心
}); 