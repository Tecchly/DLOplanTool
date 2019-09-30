class Utils {
       //Generate a uuid.
    
    static uuid() {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        )
    };

    static modeToIcon(mode) {
        
        var icon = "";
        switch (mode){
            case "video":
                icon = "md-videocam";
                break;
            case "sound":
                icon = "ios-microphone-outline";
                break;
            case "writing":
                icon = "ios-paper";
                break;
            case "image":
                    icon = "ios-image";
                break;
            default:
                    icon = "ios-bulb";   
        }
            return icon;            
    }
}

export default Utils;