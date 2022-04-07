export const getPostDate = utcDate => {
    const date = new Date(utcDate);

    const difference = new Date() - date;

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor(difference / (1000 * 60));
    const seconds = Math.floor(difference / (1000));

    let formattedDifference = date.toLocaleDateString("en-EU", {year: 'numeric', month: 'short', day: 'numeric'});

    if (days <= 7) {
        if (seconds > 0) formattedDifference = `${seconds} second${seconds > 1 ? 's' : ''} ago`;
        if (minutes > 0) formattedDifference = `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        if (hours > 0) formattedDifference = `${hours} hour${hours > 1 ? 's' : ''} ago`;
        if (days > 0) formattedDifference = `${days} day${days > 1 ? 's' : ''} ago`;
    }

    return formattedDifference;
}
