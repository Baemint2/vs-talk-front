const Vote = () => {
    return <div className="flex flex-col bg-gray-50 rounded-2xl mt-10">
        <div className="flex text-left justify-between mb-5 mt-5">
            <span>Q. 투표 제목란</span>
            <span className="mr-5">xx명참여, 복수선택가능</span>
        </div>
        <div className="flex flex-col items-center text-left">
            <div className="flex bg-amber-50 rounded-2xl w-90 mb-3 p-2">1. 내용 공간</div>
            <div className="flex bg-amber-50 rounded-2xl w-90 mb-3 p-2">2. 내용 공간</div>
            <div className="flex bg-amber-50 rounded-2xl w-90 mb-3 p-2">3. 내용 공간</div>
            <div className="flex bg-amber-50 rounded-2xl w-90 mb-3 p-2">4. 내용 공간</div>
        </div>
    </div>
}

export default Vote;