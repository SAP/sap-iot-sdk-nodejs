## 📝 Reporting Issues

### Requirements for a Bug Report

1. **Only SAP IoT SDK issues**
    * Please do not report:
        * Issues caused by dependencies or plugins.
        * Issues caused by the use of non-public/internal methods. Only the public methods listed in the API documentation may be used.
2. **No duplicate**: You have searched the [issue tracker](https://github.com/SAP/sap-iot-sdk-nodejs/issues) to make sure the bug has not yet been reported.
3. **Good summary**: The summary should be specific to the issue.
4. **Current bug**: The bug can be reproduced in the most current version.
5. **Reproducible bug**: There are step-by-step instructions provided on how to reproduce the issue.
6. **Well-documented**:
    * Precisely state the expected and the actual behavior.
    * Give information about the environment in which the issue occurs (OS/Platform, Node.js version, etc.).
    * Generally, give as much additional information as possible.
8. **Only one bug per report**: Open additional tickets for additional issues.
9. **Please report bugs in English.**

### Reporting Security Issues
If you find a security issue, act responsibly and do not report it in the public issue tracker, but directly to us. Please refer [here for more information](./SECURITY.md).


## 💻 Contributing Code
### General Remarks
You are welcome to contribute code to the SAP IoT SDK in order to fix bugs or to implement new features.
There are two important things to know:

1. You must be aware of the Apache License (which describes contributions) and **agree to the Developer Certificate of Origin***. This is common practice in major Open Source projects. To make this process as simple as possible, we are using *[CLA assistant](https://cla-assistant.io/)* for individual contributions. CLA assistant is an open source tool that integrates with GitHub very well and enables a one-click experience for accepting the DCO. For company contributers, special rules apply. See the respective section below for details.
2. **Not all proposed contributions can be accepted**. Some features may just fit a third-party add-on better. The code must match the overall direction of the SAP IoT SDK and improve it. For most bug fixes this is a given, but a major feature implementation first needs to be discussed with one of the committers. Possibly, one who touched the related code or module recently. The more effort you invest, the better you should clarify in advance whether the contribution will match the project's direction. The best way would be to just open an issue to discuss the feature you plan to implement (make it clear that you intend to contribute). We will then forward the proposal to the respective code owner. This avoids disappointment.

### Developer Certificate of Origin (DCO)

Due to legal reasons, contributors will be asked to accept a DCO before they submit the first pull request to this projects, this happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

This happens in an automated fashion during the submission process: The CLA assistant tool will add a comment to the pull request. Click it to check the DCO, then accept it on the following screen. CLA assistant will save this decision for upcoming contributions.
