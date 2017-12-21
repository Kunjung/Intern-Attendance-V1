
let HashRouter = ReactRouterDOM.HashRouter;
let Route = ReactRouterDOM.Route;
let Link = ReactRouterDOM.Link;

let Row = ReactBootstrap.Row;
let Grid = ReactBootstrap.Grid;
let Col = ReactBootstrap.Col;


////////////// Editing

let API_URL = 'https://c4q8oqddyj.execute-api.eu-west-2.amazonaws.com/prod/internattendance';

let VERIFY_API_URL = 'https://c4q8oqddyj.execute-api.eu-west-2.amazonaws.com/prod/verifymail';



let NAMES_API_URL = 'https://c4q8oqddyj.execute-api.eu-west-2.amazonaws.com/prod/namelist';

let SEND_PASSWORD_API_URL = 'https://c4q8oqddyj.execute-api.eu-west-2.amazonaws.com/prod/sendmail';


///////////////// BEginning of Send Password /////////////////////////////////////////

class SendPassword extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      names: [],
      selectedName: '',
      day: '1',
      subject: 'Attendance Password for Day 1',
      info: '',
      showSecret: this.props.showSecret
    };
    this.getAllNames();
    this.handleChange = this.handleChange.bind(this);
    this.dayChange = this.dayChange.bind(this);
    this.sendPasswordMail = this.sendPasswordMail.bind(this);
    
  }



  componentWillReceiveProps(newProps) {
    this.setState({
        showSecret: newProps.showSecret
    });
  }

  getAllNames() {

    // get the intern name list and set the names state
    console.log("Called All names");
    axios.get(NAMES_API_URL, {
      params: {
        nothing: ''
      }
    })
    .then(response => {

      let jsonResponse = JSON.parse(response.data);
      console.log("trying json parsing");
      console.log(jsonResponse);
      let nameList = jsonResponse['names'];
      console.log("The Length of NamesList is " + nameList.length);
      let currentName = (nameList.length > 0) ? nameList[0] : '';
      this.setState({
          names: nameList,
          selectedName: currentName
      });

    })
    .catch(error => {
      this.setState({
        names: ['error']
      });
    });

  }

  sendPasswordMail(e) {
    e.preventDefault();
    // Send The Password for the intern for that day
    let day = this.state.day;
    let subject = this.state.subject;
    let intern_name = this.state.selectedName;

    axios.get(SEND_PASSWORD_API_URL, {
      params: {
        day: day,
        subject: subject,
        intern_name: intern_name
      }
    })
    .then(response => {
      this.setState({
        info: response.data
      });
    })
    .catch(error => {
      this.setState({
        info: "Not Sent"
      });
    });

  }

  dayChange(e) {
    let val = e.target.value;
    this.setState({
        day: val,
        subject: "Attendance for Day " + val
    });
  }

  handleChange(e) {
    let value = e.target.value;
    console.log(value, " was selected");
    this.setState({ selectedName: value });
  }

  render() {
    let show = this.state.showSecret;
    if (show == false) {
        return <div>Nothing</div>;
    }
    const nameItems = this.state.names.map((name) => 
      <option key={name} value={name}>{name}</option>
    );
    console.log("I got this far");

    return (
      <div>
        <h1>Secret Door #1</h1>
        <h2>Mail Today's Password</h2>
        <form>
          <select value={this.state.selectedName} onChange={this.handleChange}>
            {nameItems}
          </select>
          <h3>Current Name: {this.state.selectedName}</h3>

          <input type="text" name="intern_name" value={this.state.selectedName} hidden/>
          <input type="text" name="subject" value={this.state.subject} hidden/>
          
          <label>Day</label>
          <input type="text" name="day" value={this.state.day} onChange={this.dayChange}/>
          <br/>
          <button onClick={this.sendPasswordMail}>Send Password Mail</button>
        </form>
        <div style={{ color:"white" }}>
          <h1> {this.state.info} </h1>
        </div>
      </div>
    )
  }
}


////////////////////// ENding of Send Password //////////////////////////////////////////


///////////////////// Beginning of Intern Component ////////////////////////////////////////
let Intern = React.createClass({
  getInitialState: function() {
    return {
      day: '1',
      u: '',
      p: '',
      yesterday: 'past',
      today: 'future',
      info: '',
    }
  },

  uChange: function (e) {
    this.setState({
      u: e.target.value
    });
  },

  pChange: function (e) {
    this.setState({
      p: e.target.value
    });
  },

  dayChange: function (e) {
    this.setState({
      day: e.target.value
    });
  },

  yesterdayChange: function (e) {
    this.setState({
      yesterday: e.target.value
    });
  },

  todayChange: function (e) {
    this.setState({
      today: e.target.value
    });
  },


  fetchData: function(e) {
    e.preventDefault();
    let day = this.state.day;
    let u = this.state.u;
    let p = this.state.p;
    let yesterday = this.state.yesterday;
    let today = this.state.today;

    axios.get(API_URL, {
      params: {
        day: day,
        u: u,
        p: p,
        y: yesterday,
        t: today
      }
    })
    .then(response => {
      this.setState({
        info: response.data
      });
    })
    .catch(error => {
      this.setState({
        info: "There's an error in the reequest"
      });
    });
  },


  render: function() {
    return (
    <Row>
    <Col md={3}>
    </Col>

    <Col md={6}>
      <h1>Good Morning, {this.state.u} </h1>
      <img src="paulgraham.jpg" height="180"/>

      <h2>What is your focus for the Day?</h2>
      <form method="GET">

          <div>
            <label>Name</label>
                <input type="text" name="u" value={this.state.u} onChange={this.uChange}/>
            </div>

          <div>
            <label>Password</label>
                <input type="text" name="p" value={this.state.p} onChange={this.pChange}/>
            </div>

            <div>
          <label>Day</label>
                <input type="text" name="day" value={this.state.day} onChange={this.dayChange}/>
            </div>

          <div>
            <label>What did you do Yesterday?</label>
                <input type="text" size="50" name="yesterday" value={this.state.yesterday} onChange={this.yesterdayChange}/>
            </div>

          <div>
            <label>What are you going to do today?</label>
                <input type="text" size="50" name="today" value={this.state.today} onChange={this.todayChange}/>
            </div>


            <button onClick={this.fetchData}>Check Attendance</button>

      </form>

       <div style={{ color:"white" }}>
          <h1>Info</h1>
          <h3> {this.state.info} </h3>
       </div>
    </Col>

    <Col md={3}>
    </Col>
    </Row>
    )
  }
})

/////////////////////// End of Intern Component ################################


//////////////////////////// Beginning of SecretDoor/ ///////////////////////////////
class SecretDoor extends React.Component {

  constructor(props) {
    super(props);
    console.log("Can U See ME? The props are " + this.props.showSecret)

    this.state = {
      u: '',
      email: '',
      info: '',
      showSecret: this.props.showSecret
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
        showSecret: newProps.showSecret
    });
  }

  uChange(e) {
    this.setState({
      u: e.target.value
    });
  }

  emailChange(e) {
    this.setState({
      email: e.target.value
    });
  }

  addNewIntern(e) {
    e.preventDefault();
    // Add new Intern to the interns table and the intern_emails table
    axios.get(API_URL, {
      params: {
        addNewIntern: "AllSetToGo",
        u: this.state.u,
        email: this.state.email
      }
    })
    .then(response => {
      this.setState({
        info: response.data
      });
    })
    .catch(error => {
      this.setState({
        info: "There's an error in the reequest"
      });
    });

    // Send the Verification email to the intern to add them to the aws's verification list
    axios.get(VERIFY_API_URL, {
      params: {
        new_email: this.state.email
      }
    })
    .then(response => {
      console.log(response.data);
    })
    .catch(error => {
      console.log("There's an error in the request");
    });

  }

  render() {
    
    let show = this.state.showSecret;
    if (show == true) {
        return  (<div>
                      <h1> Secret Door #2 </h1>
                      <h2> Add New Intern </h2>
                      
                      <form>
                        <label>Enter new interns name</label>
                        <input style={{color: "red"}} type="text" name="u" onChange={this.uChange} value={this.state.u}/>
                        <label>Enter new interns email</label>
                        <input style={{color: "red"}} type="text" name="email" onChange={this.emailChange} value={this.state.email}/>
                        <button onClick={this.addNewIntern}>Add New Intern</button>
                      </form>
                      <div style={{ color:"white" }}>
                          <h3> {this.state.info} </h3>
                      </div>
                    </div>
                );
    }
    else {
        return <div>Nothing</div>;
    }
   
  }

}



////////////////////////// End of Secret Door /////////////////////////////////




/////////////////////// Beginning of Admin Component ##############################
let Admin = React.createClass({
  getInitialState: function() {
    return {
      day: '1',
      u: '',
      p: '',
      info: '',
      showSecret: false
    }
  },

  uChange: function (e) {
    this.setState({
      u: e.target.value
    });
  },

  pChange: function (e) {
    this.setState({
      p: e.target.value
    });
  },

  dayChange: function (e) {
    this.setState({
      day: e.target.value
    });
  },



  fetchData: function(e) {
    e.preventDefault();
    let day = this.state.day;
    let u = this.state.u;
    let p = this.state.p;


    axios.get(API_URL, {
      params: {
        day: day,
        u: u,
        p: p
      }
    })
    .then(response => {
      this.setState({
        info: response.data
      });
    })
    .catch(error => {
      this.setState({
        info: "There's an error in the reequest"
      });
    });
  },

  openSecretDoor: function(e) {
    e.preventDefault();
    let u = this.state.u;
    let p = this.state.p;
    console.log("Opening Secret Door");

    if (u == 'admin' && p == 'youshallnotpass') {
      let currentState = this.state.showSecret;
      let newState = true;
      if (currentState == true) {
        newState = false;
      } else {
        newState = true;
      }
      this.setState({
        showSecret: newState
      })
    }
    console.log("The secret state is " + this.state.showSecret);

  },

  render: function() {
    return (
    <Row>
    
        <Col md={3}>

            <SendPassword showSecret={this.state.showSecret}/>
        
        </Col>

        <Col md={6}>

            <div>
              <h1>Good Morning, Admin </h1>

              <button onClick={this.openSecretDoor.bind(this)}>
              <img src="sakamoto.jpg" height="180"/>
              </button>

              <form method="GET">

                  <div>
                    <label>Admin Name</label>
                        <input type="text" name="u" value={this.state.u} onChange={this.uChange}/>
                    </div>

                  <div>
                    <label>Admin Password</label>
                        <input type="text" name="p" value={this.state.p} onChange={this.pChange}/>
                    </div>

                    <div>
                  <label>Day</label>
                        <input type="text" name="day" value={this.state.day} onChange={this.dayChange}/>
                    </div>

                    <button onClick={this.fetchData}>Check Attendance</button>

              </form>

               <div style={{ color:"white" }}>
                  <h1>Info</h1>
                  <h3> {this.state.info} </h3>
               </div>
            </div>

        </Col>


        <Col md={3}>

            <SecretDoor showSecret={this.state.showSecret}/>

        </Col>

    </Row>
   
    )
  }
})



////////////////////////// End of Admin Component #######################


class Home extends React.Component {
    render(){
        return(
            <div>
                <nav className="navbar navbar-default">
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#">Attendance</a>
                        </div>
                        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                            <ul className="nav navbar-nav">
                                {/* Change from a to Link */}
                                <li><Link to="/about">Home</Link></li>
                                <li><Link to="/intern">Intern</Link></li>
                                <li><Link to="/admin">Admin</Link></li>
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        );
    }
}



class About extends React.Component {
    render(){
        return (
            <div style={{color: "white"}}>
                <h1>We begin in darkness</h1>
                <h1>Then, a single spark</h1>
                <h1>And change ripples through the world</h1>
                <h1>The seed in the soil seeks light</h1>
                <h1>The cell splits in two</h1>
                <h1>The Mind pulses with knowledge</h1>
            </div>
        );
    }
}


ReactDOM.render(
    <HashRouter>
        <div>
            <Route path="/" component={Home}/>
            <Route path="/intern" component={Intern}/>
            <Route path="/admin" component={Admin}/>
            <Route path="/about" component={About}/>
        </div>
    </HashRouter>,
    document.getElementById('routingStuff')
);