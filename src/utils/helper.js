import addStory from '../../src/assets/images/addStory.png'
import noSearch from '../../src/assets/images/no-search.gif'
import noCal from '../../src/assets/images/no-calendar.gif'

export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials =(name) =>{
    if(!name) return "";

    const words = name.split(" ");
    let initials = "";

    for(let i=0;i<Math.min(words.length,2);i++)
    {
        initials += words[i][0];
    }

    return initials.toUpperCase();
}


export const getEmptyCardMessage = (filterType) =>{
    switch(filterType){
        case "search":
            return `Sorry Traveller! No stories found matching to your search.`;

        case "date":
            return `Sorry Traveller! No stories found in the given data range.`;    
        
        default:
            return `Start creating your first travel Story, Click the 'Add' button and write down your thoughts, ideas and memories!`;
    }
}


export const getEmptyImg = (filterType) =>{
    switch(filterType){
        case "search":
            return noSearch;

        case "date":
            return noCal;    
        
        default:
            return addStory;
    }
}