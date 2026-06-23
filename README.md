# NextStep-project

Routes for the placement preparation section 

Route to show the topics in placemnet i.e. Apptitude, dsa etc is : 
    ==>/api/placementprep/topics

Route to show the sub topics in the main topics like ARRAYS, hashmaps and all is : 
    ==>/api/placementprep/topics/dsa
    ==>/api/placementprep/topics/aptitude

Route to get the questions and questions links by giving subtopic as arrays or Strings or any topic we get the questions oriented to the topic
    ==>/api/placementprep/topics/dsa/:subtopic

Route to get the login and register end point : 
    ==> /api/auth/login/
    ==> /api/auth/register/








Routes for examprep module :
    Routes to get subjects list of a particular branch and sem are variable:
        ==>/api/examprep/branch/sem/
    routes to get notes or pyq download links (mention type as pyq or notes):
        ==>/api/examprep/branch/sem/subid/type




AI chat bot route
    /chat    
