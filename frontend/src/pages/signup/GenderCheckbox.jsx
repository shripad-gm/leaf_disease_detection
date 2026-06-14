const GenderCheckbox = ({onCheckboxChange,selectedGender}) => {
	return (
		<div className='flex gap-4'>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer ${selectedGender==="male"?"selected":""}`}>
					<span className='label-text text-[10px] font-black uppercase tracking-widest text-slate-400'>Male</span>
					<input type='checkbox' className='checkbox checkbox-success border-white/20 checkbox-sm' 
					checked={selectedGender==="male"}
					onChange={()=>onCheckboxChange("male")}
					/>
				</label>
			</div>
			<div className='form-control'>
				<label className={`label gap-2 cursor-pointer ${selectedGender==="female"?"selected":""}`}>
					<span className='label-text text-[10px] font-black uppercase tracking-widest text-slate-400'>Female</span>
					<input type='checkbox' className='checkbox checkbox-success border-white/20 checkbox-sm' 
					checked={selectedGender==="female"}
					onChange={()=>onCheckboxChange("female")}
					/>
				</label>
			</div>
		</div>
	);
};

export default GenderCheckbox;