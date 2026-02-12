import {React,useEffect} from 'react';
import { getInitials } from '../../utils/helper';
import { Link } from 'react-router-dom';

const ProfileInfo = ({ userInfo, onLogout }) => {
    const defaultOld =
  'https://res.cloudinary.com/travel-book/image/upload/v1720536854/travel_book/default-avatar.png';

const defaultNew =
  'https://travelbook.devbysahil.com/avatar-default.png';

const profileImageUrl =
  userInfo?.profileImage === defaultOld
    ? defaultNew
    : userInfo?.profileImage;

    
    return (
        userInfo && (
            <div className='flex items-center gap-3'>
                <Link to="/profile" className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100 hover:bg-slate-200 transition-colors overflow-hidden">
                    {userInfo.profileImage ? (
                        <img 
                            src={profileImageUrl} 
                            alt={userInfo.fullName || "User"} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                            }}
                        />
                    ) : (
                        <span className="flex items-center justify-center w-full h-full">
                            {userInfo && userInfo.fullName && getInitials(userInfo.fullName)}
                        </span>
                    )}
                </Link>

                <div>
                    <Link to="/profile" className="text-sm font-medium hover:text-cyan-600 transition-colors">
                        {userInfo && userInfo.fullName ? userInfo.fullName : ""}
                    </Link>
                    {userInfo?.email === 'sahilk64555@gmail.com' && (
                        <Link 
                            to="/admin/contributors" 
                            className="block text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
                        >
                            Admin Panel
                        </Link>
                    )}
                    <button className="block text-sm text-slate-700 dark:text-slate-300 underline" onClick={onLogout}>
                        Logout
                    </button>
                </div>
            </div>
        )
    );
};

export default ProfileInfo;
