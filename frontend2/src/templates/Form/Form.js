import React, { useState } from 'react';
import { Button } from "react-bootstrap";
import Formstyles from "./Form.module.css";

function Form() {
    const [username, setUsername] = useState('');
    const [userId, setUserId] = useState('');
    const [showUpload, setShowUpload] = useState(false);
    const [isUploading, setIsUploading] = useState(false); // ✅ 控制按鈕鎖定
    const [images, setImages] = useState({
        left: null,
        middle: null,
        right: null,
    });
    const [previews, setPreviews] = useState({
        left: '',
        middle: '',
        right: '',
    });

    const handleUsernameSubmit = async () => {
        if (!username.trim()) {
            alert('Please enter your name before proceeding.');
            return;
        }

        const id = username.trim().toLowerCase().replace(/\s+/g, '_');

        try {
            const res = await fetch(`/check-user-id?user_id=${id}`);
            const data = await res.json();

            if (data.exists) {
                const confirmJump = window.confirm('這個名稱已被使用。\n是否要直接查看該使用者的歷史分析結果？');
                if (confirmJump) {
                    window.location.href = `/AnalysisResult?user_id=${id}`;
                } else {
                    // 回到輸入頁面，清空欄位
                    setUsername('');
                }
                return;
            }

            setUserId(id);
            setShowUpload(true);
        } catch (err) {
            alert('檢查 user_id 時發生錯誤，請稍後再試。');
        }
    };

    const handleImageChange = (e, position) => {
        const file = e.target.files[0];
        if (file) {
            const newImages = { ...images, [position]: file };
            setImages(newImages);

            const reader = new FileReader();
            reader.onload = () => {
                setPreviews(prev => ({ ...prev, [position]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (isUploading) return;
        setIsUploading(true);

        const formData = new FormData();
        formData.append('user_id', userId);
        formData.append('left', images.left);
        formData.append('middle', images.middle);
        formData.append('right', images.right);

        try {
            const res = await fetch('/upload', {
                method: 'POST',
                body: formData,
            });
            const result = await res.json();
            if (result.success) {
                window.location.href = `/AnalysisResult?user_id=${result.user_id}`;
            } else {
                alert('Upload failed. Please try again.');
                setIsUploading(false);
            }
        } catch (err) {
            alert('Upload failed. Please try again.');
            setIsUploading(false);
        }
    };

    return (
        <div className={Formstyles.container}>
            <div className={Formstyles.bodytitle} id="Upload Photo">
                AI即時檢測 :
            </div>

            {!showUpload && (
                <form className={Formstyles.form}>
                    <label htmlFor="username" className={Formstyles.label}>輸入姓名 (English only):</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Enter your name..."
                        required
                        className={Formstyles.input}
                    />
                    <button
                        type="button"
                        onClick={handleUsernameSubmit}
                        className={Formstyles.button}
                    >
                        下一步
                    </button>
                </form>
            )}

            {showUpload && (
                <form onSubmit={handleUpload} encType="multipart/form-data" className={Formstyles.form}>
                    <input type="hidden" name="user_id" value={userId} />
                    <label className={Formstyles.label2}>
                        <div style={{ width: '33%', textAlign: 'left' }}>
                            <Button
                                type="button"
                                variant="outline-danger"
                                onClick={() => setShowUpload(false)}
                            >
                                ← 回上一頁
                            </Button>
                        </div>
                        <div style={{ width: '33%' }}>
                            上傳三張照片 (左,中,右)
                        </div>
                        <div style={{ width: '33%' }}></div>
                    </label>

                    <div className={Formstyles.previewContainer}>
                        {['left', 'middle', 'right'].map((pos) => (
                            <div key={pos} className={Formstyles.previewBlock}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    required
                                    onChange={(e) => handleImageChange(e, pos)}
                                    className={Formstyles.input}
                                />
                                {previews[pos] && (
                                    <>
                                        <img
                                            src={previews[pos]}
                                            alt={`${pos} Face`}
                                            className={Formstyles.previewImage}
                                        />
                                        <br />
                                        <Button
                                            type="button"
                                            variant="danger"
                                            style={{margin:'10px'}}
                                            onClick={() => {
                                                setImages(prev => ({ ...prev, [pos]: null }));
                                                setPreviews(prev => ({ ...prev, [pos]: '' }));
                                            }}
                                        >
                                            刪除
                                        </Button>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <Button
                        type="submit"
                        className={Formstyles.button}
                        disabled={isUploading}
                    >
                        {isUploading ? "分析中..." : "開始進行分析"}
                    </Button>
                </form>
            )}
        </div>
    );
}

export default Form;
