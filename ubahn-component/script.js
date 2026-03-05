document.addEventListener("DOMContentLoaded", () => {
    const cellClickSound = document.getElementById("cellClickSound");

    // 点击 cell 切换图片
    document.querySelectorAll(".cell").forEach((cell) => {
        cell.addEventListener("click", () => {
            // 播放点击音效
            if (cellClickSound) {
                cellClickSound.currentTime = 0;
                cellClickSound.play().catch(e => console.log("Audio playback failed:", e));
            }

            const images = cell.querySelectorAll("img");
            let index = [...images].findIndex((img) =>
                img.classList.contains("active")
            );
            images[index].classList.remove("active");
            images[(index + 1) % images.length].classList.add("active");
        });
    });

});
