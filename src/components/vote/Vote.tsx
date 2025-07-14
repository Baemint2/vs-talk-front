const Vote = () => {
    return <div className="w-2xl h-auto flex flex-col bg-gray-50 rounded-2xl">
        <div className="flex text-left text-2xl justify-between ml-5 mb-5 mt-5">
            <span>Q. 투표 제목란</span>
            <span className="mr-5">xx명참여, 복수선택가능</span>
        </div>
        <div className="flex flex-col items-center text-left">
            <div className="flex bg-amber-50 rounded-2xl w-140 mb-3 p-2">1. 내용 공간</div>
            <div className="flex bg-amber-50 rounded-2xl w-140 mb-3 p-2">2. 내용 공간</div>
            <div className="flex bg-amber-50 rounded-2xl w-140 mb-3 p-2">3. 내용 공간</div>
            <div className="flex bg-amber-50 rounded-2xl w-140 mb-3 p-2">4. 내용 공간</div>
        </div>
    </div>
}

export default Vote;